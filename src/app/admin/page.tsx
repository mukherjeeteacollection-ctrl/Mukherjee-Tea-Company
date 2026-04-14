'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PRODUCTS, ADMIN_EMAIL, CATEGORIES } from '@/lib/data';
import { Product } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/client';
import Logo from '@/components/Logo/Logo';
import styles from './page.module.css';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

type Tab = 'products' | 'orders';

const MOCK_ORDERS: any[] = [];

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--badge-warning, #fde047)',
  confirmed: '#60a5fa',
  shipped: '#c084fc',
  delivered: '#4ade80',
  cancelled: '#f87171',
};

export default function AdminPage() {
  const { showToast } = useToast();
  const { signOut } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', category: 'Black Tea', stock: '', image_url: '',
    origin: '', long_description: '', experience: '', tea_type: '', flavor_profile: '', aroma: '',
    caffeine_level: '', benefits: '', steep_temp: '', steep_amount: '', steep_time: '', steep_resteep: '', why_choose: '',
    weight_options: '100g, 250g', is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('tea-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('tea-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        showToast(error.message || 'Error deleting product', 'error');
      } else {
        showToast('Product deleted successfully', 'success');
        fetchProducts();
      }
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    const { error } = await (supabase.from('orders') as any)
      .update({ status })
      .eq('id', orderId);

    if (error) {
      showToast(error.message || 'Error updating status', 'error');
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
      showToast('Order status updated', 'success');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    setUploading(true);
    try {
      let finalImageUrl = editingProduct.image_url;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      // Remove fields that shouldn't be updated (id, created_at)
      const { id, created_at, ...updateData } = editingProduct;

      const { error } = await (supabase.from('products') as any)
        .update({ ...updateData, image_url: finalImageUrl })
        .eq('id', id);

      if (error) throw error;

      showToast('Product updated successfully', 'success');
      setEditingProduct(null);
      setImageFile(null);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Error updating product', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    setUploading(true);
    try {
      let finalImageUrl = '/assam-breakfast.png';
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const p = {
        name: newProduct.name,
        slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: newProduct.description,
        long_description: newProduct.long_description || null,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock) || 0,
        image_url: finalImageUrl,
        category: newProduct.category,
        origin: newProduct.origin || 'India',
        weight_options: newProduct.weight_options.split(',').map((s: string) => s.trim()).filter(Boolean),
        is_featured: newProduct.is_featured,
        is_active: true,
        experience: newProduct.experience || null,
        tea_type: newProduct.tea_type || null,
        flavor_profile: newProduct.flavor_profile || null,
        aroma: newProduct.aroma || null,
        caffeine_level: newProduct.caffeine_level || null,
        benefits: newProduct.benefits || null,
        steep_temp: newProduct.steep_temp || null,
        steep_amount: newProduct.steep_amount || null,
        steep_time: newProduct.steep_time || null,
        steep_resteep: newProduct.steep_resteep || null,
        why_choose: newProduct.why_choose || null,
      };

      const { error } = await (supabase.from('products') as any).insert([p]);
      if (error) throw error;

      showToast('Product added successfully', 'success');
      setShowAddForm(false);
      setImageFile(null);
      setNewProduct({
        name: '', price: '', description: '', category: 'Black Tea', stock: '', image_url: '',
        origin: '', long_description: '', experience: '', tea_type: '', flavor_profile: '', aroma: '',
        caffeine_level: '', benefits: '', steep_temp: '', steep_amount: '', steep_time: '', steep_resteep: '', why_choose: '',
        weight_options: '100g, 250g', is_featured: false,
      });
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Error adding product', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.adminPage}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <Logo height={42} />
          <div className={styles.sidebarLogoText}>
            <p className={styles.sidebarBrandName}>MUKHERJEE TEA</p>
            <p className={styles.sidebarAdminText}>Admin Panel</p>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          <button onClick={() => setTab('products')} className={`${styles.navItem} ${tab === 'products' ? styles.navItemActive : ''}`} id="admin-tab-products">
            📦 Products
          </button>
          <button onClick={() => setTab('orders')} className={`${styles.navItem} ${tab === 'orders' ? styles.navItemActive : ''}`} id="admin-tab-orders">
            📋 Orders
          </button>
        </nav>
        <div className={styles.sidebarStats}>
          <div className={styles.stat}><span className={styles.statVal}>{products.length}</span><span className={styles.statLabel}>Products</span></div>
          <div className={styles.stat}><span className={styles.statVal}>{orders.length}</span><span className={styles.statLabel}>Orders</span></div>
          <div className={styles.stat}><span className={styles.statVal}>₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}</span><span className={styles.statLabel}>Revenue</span></div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost" style={{ margin: '0 12px', fontSize: '0.82rem' }}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {tab === 'products' && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Products</h2>
              <button className="btn btn-secondary" onClick={() => setShowAddForm(true)} id="add-product-btn">
                + Add Product
              </button>
            </div>

            {showAddForm && (
              <div className={styles.addForm}>
                {/* ── Section 1: General Info ── */}
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, fontSize: '1.1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 10 }}>📦 General Info</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Darjeeling Gold First Flush" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} placeholder="899" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} className="form-select">
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} placeholder="50" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Origin</label>
                    <input value={newProduct.origin} onChange={e => setNewProduct(p => ({ ...p, origin: e.target.value }))} placeholder="e.g. Darjeeling, West Bengal" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight Options (comma separated)</label>
                    <input value={newProduct.weight_options} onChange={e => setNewProduct(p => ({ ...p, weight_options: e.target.value }))} placeholder="50g, 100g, 250g" className="form-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Product Image</label>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="form-input" style={{ paddingTop: 8 }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Short Description *</label>
                    <input value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} placeholder="One-line tagline for the product card" className="form-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Long Description</label>
                    <textarea value={newProduct.long_description} onChange={e => setNewProduct(p => ({ ...p, long_description: e.target.value }))} placeholder="Detailed paragraph about this tea..." className="form-input" rows={3} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={newProduct.is_featured} onChange={e => setNewProduct(p => ({ ...p, is_featured: e.target.checked }))} />
                      Featured Product (shown on homepage)
                    </label>
                  </div>
                </div>

                {/* ── Section 2: The Experience ── */}
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginTop: 28, marginBottom: 16, fontSize: '1.1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 10 }}>✨ The Experience</h3>
                <div className="form-group">
                  <label className="form-label">Experience Description</label>
                  <textarea value={newProduct.experience} onChange={e => setNewProduct(p => ({ ...p, experience: e.target.value }))} placeholder="Describe the sensory experience of this tea. What does it feel like to drink it? Paint a picture for the customer..." className="form-input" rows={4} style={{ resize: 'vertical' }} />
                </div>

                {/* ── Section 3: Product Details ── */}
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginTop: 28, marginBottom: 16, fontSize: '1.1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 10 }}>🍃 Product Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <input value={newProduct.tea_type} onChange={e => setNewProduct(p => ({ ...p, tea_type: e.target.value }))} placeholder="e.g. Whole Leaf, CTC, Rolled Pearl" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Flavor Profile</label>
                    <input value={newProduct.flavor_profile} onChange={e => setNewProduct(p => ({ ...p, flavor_profile: e.target.value }))} placeholder="e.g. Muscatel, Floral, Honey" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Aroma</label>
                    <input value={newProduct.aroma} onChange={e => setNewProduct(p => ({ ...p, aroma: e.target.value }))} placeholder="e.g. Delicate floral with a hint of musk" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Caffeine Level</label>
                    <select value={newProduct.caffeine_level} onChange={e => setNewProduct(p => ({ ...p, caffeine_level: e.target.value }))} className="form-select">
                      <option value="">Select...</option>
                      <option value="None">None (Caffeine-Free)</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Benefits</label>
                    <input value={newProduct.benefits} onChange={e => setNewProduct(p => ({ ...p, benefits: e.target.value }))} placeholder="e.g. Rich in antioxidants, Boosts immunity, Aids digestion" className="form-input" />
                  </div>
                </div>

                {/* ── Section 4: The Perfect Steep ── */}
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginTop: 28, marginBottom: 16, fontSize: '1.1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 10 }}>☕ The Perfect Steep</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Water Temperature</label>
                    <input value={newProduct.steep_temp} onChange={e => setNewProduct(p => ({ ...p, steep_temp: e.target.value }))} placeholder="e.g. 85–90°C" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount</label>
                    <input value={newProduct.steep_amount} onChange={e => setNewProduct(p => ({ ...p, steep_amount: e.target.value }))} placeholder="e.g. 2g per 200ml" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Steep Time</label>
                    <input value={newProduct.steep_time} onChange={e => setNewProduct(p => ({ ...p, steep_time: e.target.value }))} placeholder="e.g. 3–5 minutes" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Re-steeping</label>
                    <input value={newProduct.steep_resteep} onChange={e => setNewProduct(p => ({ ...p, steep_resteep: e.target.value }))} placeholder="e.g. Can be re-steeped 2-3 times" className="form-input" />
                  </div>
                </div>

                {/* ── Section 5: Why Choose ── */}
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginTop: 28, marginBottom: 16, fontSize: '1.1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 10 }}>💎 Why Choose This Tea</h3>
                <div className="form-group">
                  <label className="form-label">Why Choose</label>
                  <textarea value={newProduct.why_choose} onChange={e => setNewProduct(p => ({ ...p, why_choose: e.target.value }))} placeholder="What makes this tea unique? Why should a customer choose this over others?" className="form-input" rows={3} style={{ resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button onClick={handleAddProduct} disabled={uploading} className="btn btn-primary">
                    {uploading ? 'Processing...' : '✨ Save Product'}
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            )}

            <div className={styles.productsTable}>
              <div className={styles.tableHeader}>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Stock</span>
                <span>Actions</span>
              </div>
              {products.map(p => (
                <div key={p.id} className={styles.tableRow}>
                  <div className={styles.productCell}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0, background: 'var(--dark-surface)' }}>
                      <Image src={p.image_url} alt={p.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{p.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.origin}</p>
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>{p.category}</span>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--gold-light)' }}>₹{p.price.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '0.875rem', color: p.stock < 20 ? '#fbbf24' : 'var(--text-secondary)' }}>{p.stock}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingProduct(p)} id={`admin-edit-${p.id}`}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p.id)} id={`admin-delete-${p.id}`}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Orders</h2>
            </div>
            <div className={styles.productsTable}>
              <div className={styles.tableHeader} style={{ gridTemplateColumns: '1fr 1fr 0.7fr 0.7fr 1fr 0.8fr' }}>
                <span>Order ID</span>
                <span>Customer</span>
                <span>Items</span>
                <span>Total</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {orders.map(o => (
                <div key={o.id} className={styles.tableRow} style={{ gridTemplateColumns: '1fr 1fr 0.7fr 0.7fr 1fr 0.8fr' }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--gold-light)', fontSize: '0.875rem' }}>#{o.id}</span>
                  <div>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{o.customer}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.email}</p>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{o.items}</span>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)' }}>₹{o.total.toLocaleString('en-IN')}</span>
                  <div>
                    <select
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      style={{
                        background: 'var(--glass-bg)',
                        border: `1px solid ${STATUS_COLORS[o.status]}55`,
                        color: STATUS_COLORS[o.status],
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        appearance: 'none',
                        outline: 'none',
                      }}
                    >
                      {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s} style={{ background: '#0a1a12', color: '#f0ead6' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════
          EDIT PRODUCT MODAL
          ══════════════════════════════════════════════ */}
      {editingProduct && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '40px 20px', overflowY: 'auto',
        }}>
          <div style={{
            background: 'var(--dark-card, #111)', borderRadius: 20, padding: 32,
            width: '100%', maxWidth: 720, border: '1px solid var(--border-subtle, #333)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)' }}>✏️ Edit Product</h2>
              <button onClick={() => setEditingProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* General */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: '1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 8 }}>📦 General</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input className="form-input" type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input className="form-input" type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Origin</label>
                <input className="form-input" value={editingProduct.origin || ''} onChange={e => setEditingProduct({ ...editingProduct, origin: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight Options (comma separated)</label>
                <input className="form-input" value={(editingProduct.weight_options || []).join(', ')} onChange={e => setEditingProduct({ ...editingProduct, weight_options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Replace Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="form-input" style={{ paddingTop: 8 }} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Short Description</label>
                <input className="form-input" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Long Description</label>
                <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} value={editingProduct.long_description || ''} onChange={e => setEditingProduct({ ...editingProduct, long_description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={editingProduct.is_featured} onChange={e => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })} />
                  Featured Product
                </label>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={editingProduct.is_active} onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })} />
                  Active (visible in shop)
                </label>
              </div>
            </div>

            {/* The Experience */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: '1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 8 }}>✨ The Experience</h3>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} value={editingProduct.experience || ''} onChange={e => setEditingProduct({ ...editingProduct, experience: e.target.value })} placeholder="Sensory experience description..." />
            </div>

            {/* Product Details */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: '1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 8 }}>🍃 Product Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <input className="form-input" value={editingProduct.tea_type || ''} onChange={e => setEditingProduct({ ...editingProduct, tea_type: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Flavor Profile</label>
                <input className="form-input" value={editingProduct.flavor_profile || ''} onChange={e => setEditingProduct({ ...editingProduct, flavor_profile: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Aroma</label>
                <input className="form-input" value={editingProduct.aroma || ''} onChange={e => setEditingProduct({ ...editingProduct, aroma: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Caffeine Level</label>
                <select className="form-select" value={editingProduct.caffeine_level || ''} onChange={e => setEditingProduct({ ...editingProduct, caffeine_level: e.target.value })}>
                  <option value="">Select...</option>
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Benefits</label>
                <input className="form-input" value={editingProduct.benefits || ''} onChange={e => setEditingProduct({ ...editingProduct, benefits: e.target.value })} />
              </div>
            </div>

            {/* The Perfect Steep */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: '1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 8 }}>☕ The Perfect Steep</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Water Temp</label>
                <input className="form-input" value={editingProduct.steep_temp || ''} onChange={e => setEditingProduct({ ...editingProduct, steep_temp: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input className="form-input" value={editingProduct.steep_amount || ''} onChange={e => setEditingProduct({ ...editingProduct, steep_amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Steep Time</label>
                <input className="form-input" value={editingProduct.steep_time || ''} onChange={e => setEditingProduct({ ...editingProduct, steep_time: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Re-steeping</label>
                <input className="form-input" value={editingProduct.steep_resteep || ''} onChange={e => setEditingProduct({ ...editingProduct, steep_resteep: e.target.value })} />
              </div>
            </div>

            {/* Why Choose */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: '1rem', borderBottom: '1px solid var(--border-subtle, #333)', paddingBottom: 8 }}>💎 Why Choose</h3>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} value={editingProduct.why_choose || ''} onChange={e => setEditingProduct({ ...editingProduct, why_choose: e.target.value })} />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleUpdateProduct} disabled={uploading} className="btn btn-primary" style={{ flex: 1 }}>
                {uploading ? 'Saving...' : '✅ Save Changes'}
              </button>
              <button onClick={() => { setEditingProduct(null); setImageFile(null); }} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
