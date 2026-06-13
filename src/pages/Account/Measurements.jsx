import { useState, useEffect } from "react";
import { useAuth } from "../../store/authStore.js";
import { authAPI } from "../../api/endpoints.js";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";
import { motion } from "framer-motion";
import { Ruler, Save, Info } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../../components/common/SEO.jsx";

const Measurements = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    height: "",
    weight: "",
    bust: "",
    waist: "",
    hips: "",
    shoulder: "",
    armLength: "",
    inseam: "",
    neck: "",
    dressSize: "",
    topSize: "",
    bottomSize: "",
    braSize: "",
    heightUnit: "cm",
    measurementUnit: "inches",
  });

  useEffect(() => {
    if (user?.measurements) {
      const m = user.measurements;
      setForm({
        height: m.height || "",
        weight: m.weight || "",
        bust: m.bust || "",
        waist: m.waist || "",
        hips: m.hips || "",
        shoulder: m.shoulder || "",
        armLength: m.armLength || "",
        inseam: m.inseam || "",
        neck: m.neck || "",
        dressSize: m.dressSize || "",
        topSize: m.topSize || "",
        bottomSize: m.bottomSize || "",
        braSize: m.braSize || "",
        heightUnit: m.heightUnit || "cm",
        measurementUnit: m.measurementUnit || "inches",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const measurements = {};
      Object.entries(form).forEach(([key, val]) => {
        if (val !== "") {
          measurements[key] = isNaN(Number(val)) ? val : Number(val);
        }
      });
      const { data } = await authAPI.updateMeasurements({ measurements });
      updateUser(data.data);
      toast.success("Measurements saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all";
  const labelClass =
    "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <SEO title="My Measurements" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-8">
          {/* <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center">
            <Ruler size={28} className="text-white" />
          </div> */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold primary-700">
              My Measurements
            </h1>
            <p className="text-sm text-gray-500">
              Save your body measurements for custom-fit clothing
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Your measurements help us recommend the perfect size. For the best
            fit, have a tailor measure you or refer to our size chart.
            Measurements can be updated anytime.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
        >
          {/* Unit preference */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelClass}>Height Unit</label>
              <select
                name="heightUnit"
                value={form.heightUnit}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="ft">Feet (ft)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Measurement Unit</label>
              <select
                name="measurementUnit"
                value={form.measurementUnit}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="inches">Inches</option>
                <option value="cm">Centimeters</option>
              </select>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b">
            Body Measurements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              { name: "height", label: "Height", placeholder: "e.g. 165" },
              { name: "weight", label: "Weight (kg)", placeholder: "e.g. 60" },
              { name: "bust", label: "Bust", placeholder: "e.g. 36" },
              { name: "waist", label: "Waist", placeholder: "e.g. 28" },
              { name: "hips", label: "Hips", placeholder: "e.g. 38" },
              { name: "shoulder", label: "Shoulder", placeholder: "e.g. 16" },
              {
                name: "armLength",
                label: "Arm Length",
                placeholder: "e.g. 22",
              },
              { name: "inseam", label: "Inseam", placeholder: "e.g. 30" },
              { name: "neck", label: "Neck", placeholder: "e.g. 14" },
            ].map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type="number"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={inputClass}
                  step="0.1"
                />
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b">
            Size Preferences
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              {
                name: "dressSize",
                label: "Dress Size",
                options: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
              },
              {
                name: "topSize",
                label: "Top Size",
                options: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
              },
              {
                name: "bottomSize",
                label: "Bottom Size",
                options: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
              },
              {
                name: "braSize",
                label: "Bra Size",
                options: [
                  "30A",
                  "30B",
                  "30C",
                  "32A",
                  "32B",
                  "32C",
                  "32D",
                  "34A",
                  "34B",
                  "34C",
                  "34D",
                  "36B",
                  "36C",
                  "36D",
                  "38C",
                  "38D",
                ],
              },
            ].map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Measurements"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Measurements;
