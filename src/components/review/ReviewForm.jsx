import { useState, useRef, useEffect } from "react";
import { Star, X, Upload, AlertCircle, Loader } from "lucide-react";
import { reviewAPI } from "../../api/endpoints";
import Button from "../ui/Button";

const ReviewForm = ({
  productId,
  productName,
  onSuccess,
  onCancel,
  initialData = null,
  isEditMode = false,
  reviewId = null,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(initialData?.title || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [existingImages, setExistingImages] = useState(
    initialData?.images || []
  );
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEditMode && reviewId) {
        if (newImages.length > 0) {
          const formData = new FormData();
          formData.append("rating", rating);
          formData.append("title", title);
          formData.append("comment", comment);
          existingImages.forEach((img) => {
            formData.append("existingImages", JSON.stringify(img));
          });
          newImages.forEach((img) => {
            formData.append("images", img);
          });
          await reviewAPI.update(reviewId, formData);
        } else {
          await reviewAPI.update(reviewId, {
            rating,
            title,
            comment,
            images: existingImages,
          });
        }
      } else {
        const formData = new FormData();
        formData.append("product", productId);
        formData.append("rating", rating);
        formData.append("title", title);
        formData.append("comment", comment);
        newImages.forEach((img) => {
          formData.append("images", img);
        });
        await reviewAPI.create(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl py-2 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Your Review" : "Write a Review"}
          </h3>
          {productName && (
            <p className="text-sm text-gray-500 mt-0.5">for {productName}</p>
          )}
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md p-0.5 transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  size={32}
                  className={`transition-all duration-200 ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Review Title{" "}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Summarize your experience"
            maxLength="100"
          />
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input resize-y min-h-[120px]"
            placeholder="What did you like or dislike? Share your experience..."
            maxLength="1500"
            required
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-400">{comment.length}/1500</span>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Images <span className="text-gray-400 font-normal">(Max 5)</span>
          </label>
          <div className="flex flex-wrap gap-3 items-center">
            {existingImages.map((img, idx) => (
              <div
                key={"existing-" + idx}
                className="relative w-20 h-20 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <img
                  src={img.url}
                  alt="existing"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {previewUrls.map((url, idx) => (
              <div
                key={"new-" + idx}
                className="relative w-20 h-20 rounded-xl border-2 border-primary-300 dark:border-primary-600 overflow-hidden group"
              >
                <img
                  src={url}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {existingImages.length + newImages.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                <Upload size={20} />
                <span className="text-[10px] font-medium">Upload</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            JPEG, PNG — up to 5 images
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 rounded-xl p-3.5 border border-red-100 dark:border-red-900/30">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading}>
            {loading
              ? "Submitting..."
              : isEditMode
              ? "Update Review"
              : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
