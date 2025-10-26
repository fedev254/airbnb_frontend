import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import PropertyImageUpload from "../components/PropertyImageUpload";

// --- NEW Reusable Form for Editing a Property ---
function PropertyEditForm({ property, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: property.title,
    description: property.description,
    address: property.address,
    city: property.city,
    country: property.country,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/properties/${property.id}/`, formData);
      onSave(); // refresh + close
    } catch (error) {
      console.error('Failed to update property', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 my-6 bg-gray-100 rounded-lg border space-y-4"
    >
      <h3 className="font-bold text-lg text-gray-800">
        Edit Property Details
      </h3>

      <div>
        <label>Property Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />
      </div>
      <section className="bg-white rounded-lg p-4 shadow-md">
  <h2 className="text-xl font-semibold mb-2">Property Images</h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    {property.images && property.images.length > 0 ? (
      property.images.map((img) => (
        <div key={img.id} className="relative">
          <img
            src={img.image}
            alt="Property"
            className="rounded-lg w-full h-40 object-cover"
          />
          <button
            onClick={async () => {
              try {
                await api.delete(`/properties/${property.id}/delete-image/${img.id}/`);
                setProperty((prev) => ({
                  ...prev,
                  images: prev.images.filter((i) => i.id !== img.id),
                }));
              } catch (err) {
                console.error(err);
                alert("Failed to delete image");
              }
            }}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
          >
            ✕
          </button>
        </div>
      ))
    ) : (
      <p>No property images uploaded yet.</p>
    )}
  </div>

  <PropertyImageUpload
    propertyId={property.id}
    onUploadSuccess={(newImage) =>
      setProperty((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  />
</section>


      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label>City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label>Country</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// --- Reusable Form for Creating or Editing a Unit ---
function UnitForm({ propertyId, existingUnit, onSave, onCancel }) {
  const isEditing = !!existingUnit;
  const [unitData, setUnitData] = useState({
    unit_name_or_number: existingUnit?.unit_name_or_number || '',
    price_per_night: existingUnit?.price_per_night || '',
    max_guests: existingUnit?.max_guests || 1,
    bedrooms: existingUnit?.bedrooms || 1,
    bathrooms: existingUnit?.bathrooms || 1,
  });
  const [amenitiesStr, setAmenitiesStr] = useState(
    existingUnit?.amenities?.join(', ') || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setUnitData({ ...unitData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...unitData,
      property: propertyId,
      amenities: amenitiesStr
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing) {
        await api.patch(`/host/units/${existingUnit.id}/`, payload);
      } else {
        await api.post(`/host/units/`, payload);
      }
      onSave();
    } catch (err) {
      console.error('Failed to save unit', err);
      setError('Failed to save unit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-50 border rounded-lg space-y-4 my-4"
    >
      <h3 className="text-xl font-bold text-gray-900">
        {isEditing ? `Editing: ${existingUnit.unit_name_or_number}` : 'Add New Unit'}
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Basic fields */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Unit Name/Number
        </label>
        <input
          name="unit_name_or_number"
          value={unitData.unit_name_or_number}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Bedrooms</label>
          <input
            name="bedrooms"
            type="number"
            min="1"
            value={unitData.bedrooms}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Bathrooms</label>
          <input
            name="bathrooms"
            type="number"
            min="1"
            value={unitData.bathrooms}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Price per Night (KES)</label>
          <input
            name="price_per_night"
            type="number"
            min="0"
            value={unitData.price_per_night}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Max Guests</label>
          <input
            name="max_guests"
            type="number"
            min="1"
            value={unitData.max_guests}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label>Amenities (comma-separated)</label>
        <input
          value={amenitiesStr}
          onChange={(e) => setAmenitiesStr(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Save Unit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// --- Unit Card (with Image Upload Section) ---
function ManageUnitCard({ unit, onEdit, onDelete, refreshData }) {
  const fileInputRef = useRef(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    if (caption) formData.append('caption', caption);
    try {
      await api.post(`/host/units/${unit.id}/add-image/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCaption('');
      fileInputRef.current.value = null;
      refreshData();
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Delete this image permanently?')) {
      try {
        await api.delete(`/host/unit-images/${imageId}/`);
        refreshData();
      } catch (error) {
        console.error('Failed to delete image', error);
      }
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold">{unit.unit_name_or_number}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {unit.bedrooms} Bed • {unit.bathrooms} Bath • Max {unit.max_guests} Guests
          </p>
          <p className="text-blue-600 font-bold mt-2">
            KES {unit.price_per_night?.toLocaleString()} / night
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-blue-600">Edit</button>
          <button onClick={onDelete} className="text-red-600">Delete</button>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mt-4 border-t pt-4">
        <h5 className="font-semibold mb-2">Images</h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
          {unit.images?.length > 0 ? (
            unit.images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image}
                  alt={img.caption || ''}
                  className="w-full h-28 object-cover rounded-md shadow-sm"
                />
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs font-bold opacity-0 group-hover:opacity-100"
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No images yet.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input type="file" ref={fileInputRef} accept="image/*" />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption"
            className="border p-2 rounded-md flex-grow"
          />
          <button
            onClick={handleImageUpload}
            disabled={isUploading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function ManagePropertyPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/${propertyId}/`);
      setProperty(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch property details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!window.confirm('Delete this unit?')) return;
    try {
      await api.delete(`/host/units/${unitId}/`);
      fetchProperty();
    } catch (err) {
      alert('Error deleting unit.');
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  if (loading)
    return <p className="text-center py-20">Loading management console...</p>;
  if (error) return <p className="text-red-500 text-center py-20">{error}</p>;
  if (!property)
    return <p className="text-center py-20">Property not found.</p>;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-8 space-y-8">
          <div className="border-b pb-6 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <p className="text-gray-600">
                {property.address}, {property.city}
              </p>
            </div>

            {!isEditingProperty && (
              <button
                onClick={() => setIsEditingProperty(true)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Edit Property
              </button>
            )}
          </div>

          {isEditingProperty ? (
            <PropertyEditForm
              property={property}
              onSave={() => {
                setIsEditingProperty(false);
                fetchProperty();
              }}
              onCancel={() => setIsEditingProperty(false)}
            />
          ) : (
            <p className="mt-4 text-gray-700">{property.description}</p>
          )}

          <div className="border-t pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Units</h2>
              {!editingUnit && (
                <button
                  onClick={() => setEditingUnit('new')}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  + Add New Unit
                </button>
              )}
            </div>

            {editingUnit && (
              <UnitForm
                propertyId={property.id}
                existingUnit={editingUnit === 'new' ? null : editingUnit}
                onSave={() => {
                  setEditingUnit(null);
                  fetchProperty();
                }}
                onCancel={() => setEditingUnit(null)}
              />
            )}

            <div className="space-y-4 mt-6">
              {property.units?.length > 0 ? (
                property.units.map((unit) => (
                  <ManageUnitCard
                    key={unit.id}
                    unit={unit}
                    onEdit={() => setEditingUnit(unit)}
                    onDelete={() => handleDeleteUnit(unit.id)}
                    refreshData={fetchProperty}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">
                    This property has no units yet.
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Click "Add New Unit" to create your first one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
