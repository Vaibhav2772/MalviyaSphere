import React, { useRef, useState } from 'react';
import './ProfilePictureUpload.css';
import { Upload, X, AlertCircle, Camera } from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function ProfilePictureUpload({ value, onChange }) {
  const fileInputRef = useRef(null);
  const [fileError, setFileError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // Validate type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setFileError('Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('Image file is too large. Maximum allowed size is 3MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read and preview
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      onChange(loadEvent.target.result);
    };
    reader.onerror = () => {
      setFileError('Failed to read the selected image file. Please try another.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="profile-pic-upload-container">
      <label className="input-label" htmlFor="avatar-file-input">
        Profile Picture <span className="label-optional">(Optional)</span>
      </label>

      <div className="upload-box-layout">
        {/* Preview Frame */}
        <div className="avatar-preview-box">
          {value ? (
            <img src={value} alt="Profile preview" className="avatar-preview-img" />
          ) : (
            <div className="avatar-placeholder-box" aria-hidden="true">
              <Camera size={28} className="placeholder-camera-icon" />
            </div>
          )}
        </div>

        {/* Action Controls & Instructions */}
        <div className="upload-controls-col">
          <input
            ref={fileInputRef}
            type="file"
            id="avatar-file-input"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="visually-hidden-file-input"
            aria-label="Upload profile picture"
          />

          <div className="upload-buttons-group">
            <button
              type="button"
              onClick={triggerUpload}
              className="btn-upload-select"
            >
              <Upload size={15} />
              <span>{value ? 'Replace Picture' : 'Upload Image'}</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="btn-upload-remove"
                aria-label="Remove uploaded picture"
              >
                <X size={15} />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p className="upload-helper-note">
            Supports JPG, PNG, WEBP, or GIF (max 3MB). This photo will represent you on campus interest boards.
          </p>

          {fileError && (
            <div className="upload-error-alert" role="alert">
              <AlertCircle size={15} />
              <span>{fileError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePictureUpload;
