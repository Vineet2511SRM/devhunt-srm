import { useState } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

const ImageUploader = ({ images = [], onChange, maxFiles = 4 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    const validImages = newFiles.filter((file) => file.type.startsWith('image/'));
    const combined = [...images, ...validImages].slice(0, maxFiles);
    onChange(combined);
  };

  const removeFile = (index) => {
    const filtered = images.filter((_, idx) => idx !== index);
    onChange(filtered);
  };

  return (
    <div>
      {/* Drag and Drop Zone */}
      {images.length < maxFiles && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-accent)' : 'var(--color-border-hover)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            textAlign: 'center',
            background: isDragging ? 'rgba(139, 92, 246, 0.08)' : 'var(--color-bg-input)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            marginBottom: 'var(--space-4)',
          }}
          onClick={() => document.getElementById('file-input-uploader').click()}
        >
          <input
            id="file-input-uploader"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <FiUploadCloud style={{ fontSize: '2.5rem', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }} />
          <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
            Drag & drop project screenshots here, or <span style={{ color: 'var(--color-accent)' }}>browse</span>
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            PNG, JPG, WebP up to 5MB (Max {maxFiles} images)
          </p>
        </div>
      )}

      {/* Uploaded Thumbnails Preview */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
          {images.map((file, idx) => {
            const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 9',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                }}
              >
                <img src={previewUrl} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FiX size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
