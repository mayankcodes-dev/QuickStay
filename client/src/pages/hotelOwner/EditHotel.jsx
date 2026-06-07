import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const CITIES = [
  'Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Jaipur',
  'Goa','Shimla','Manali','Udaipur','Agra','Varanasi','Kochi','Mysore',
  'Ooty','Coorg','Rishikesh','Mussoorie','Darjeeling','Amritsar',
  'Jodhpur','Ahmedabad','Surat','Chandigarh','Bhopal','Indore','Lucknow',
];

const EditHotel = () => {
  const { axios, getToken, user } = useAppContext();
  const [hotel,   setHotel]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name:    '',
    address: '',
    city:    '',
    contact: '',
    description: '',
  });

  // Fetch owner's hotel
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const { data } = await axios.get('/api/hotels/owner', {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (data.success && data.hotel) {
          setHotel(data.hotel);
          setForm({
            name:        data.hotel.name        || '',
            address:     data.hotel.address     || '',
            city:        data.hotel.city        || '',
            contact:     data.hotel.contact     || '',
            description: data.hotel.description || '',
          });
          if (data.hotel.image) setPreview(data.hotel.image);
        }
      } catch { toast.error('Failed to load hotel info'); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hotel) return toast.error('No hotel found to update');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('image', imgFile);

      const { data } = await axios.patch('/api/hotels/owner', fd, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.success) toast.success('✅ Hotel updated successfully!');
      else toast.error(data.message);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const field = (label, key, type = 'text', opts = {}) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide mb-1.5"
        style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
        style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        {...opts}
      />
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 rounded-full animate-spin"
        style={{ borderColor: 'var(--color-primary) transparent transparent transparent' }} />
    </div>
  );

  return (
    <div>
      <Helmet><title>Edit Hotel — YoYo Rooms Owner</title></Helmet>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#E8003D' }}>Hotel Owner</p>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
          Edit Hotel Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Update your hotel's details, photo, and contact information.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 flex flex-col gap-5 max-w-2xl"
        style={{ background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-md)' }}
      >
        {/* Hero image */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: 'var(--color-text-muted)' }}>Hotel Photo</label>
          <div className="flex items-center gap-4">
            {preview && (
              <img src={preview} alt="Hotel preview"
                className="w-24 h-20 object-cover rounded-xl"
                style={{ border: '2px solid var(--color-border)' }} />
            )}
            <label className="cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:border-primary"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              📷 Choose Photo
              <input type="file" accept="image/*" onChange={handleImg} className="hidden" />
            </label>
            {imgFile && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{imgFile.name}</span>}
          </div>
        </div>

        {field('Hotel Name', 'name', 'text', { required: true })}
        {field('Address', 'address', 'text', { required: true })}

        {/* City dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-text-muted)' }}>City</label>
          <select
            value={form.city}
            onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
            className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            required
          >
            <option value="">Select city…</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {field('Contact Number', 'contact', 'tel')}

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-text-muted)' }}>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={4}
            maxLength={500}
            placeholder="Tell guests what makes your hotel special…"
            className="w-full rounded-xl px-4 py-3 text-sm border outline-none resize-none"
            style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
          <p className="text-xs text-right mt-1" style={{ color: 'var(--color-text-muted)' }}>{form.description.length}/500</p>
        </div>

        <button type="submit" disabled={saving}
          className="btn-primary py-3 text-sm rounded-xl font-bold disabled:opacity-60 mt-2">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : '💾 Save Changes'}
        </button>
      </motion.form>
    </div>
  );
};

export default EditHotel;
