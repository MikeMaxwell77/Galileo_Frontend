// EditBookmarkForm.jsx
import { useState } from "react";
import BookmarkService from './../../GalileoBackendServices/BookmarksService';

export default function EditBookmarkForm({ existingBookmarkId, onSuccess, onCancel }) {
    const [dateInput, setDateInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async () => {
        if (!dateInput) return;
        setIsSubmitting(true);

        // DateToLong is async — must be awaited
        const longDate = await BookmarkService.DateToLong(dateInput);

        try {
            await BookmarkService.UpdateBookmarkDate(existingBookmarkId, longDate);
            onSuccess?.();
        } catch (error) {
            console.error("Bookmark Update Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <label className="form-label">New Date</label>
            <input
                type="date"
                className="form-control mb-3"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
            />
            <div className="d-flex gap-2">
                <button
                    className="btn-warp"
                    onClick={handleUpdate}
                    disabled={isSubmitting || !dateInput}
                >
                    {isSubmitting ? "Saving..." : "Update Date"}
                </button>
                {onCancel && (
                    <button className="btn-warp" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}