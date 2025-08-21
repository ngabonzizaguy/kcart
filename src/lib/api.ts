import { API_CONFIG } from '../../src_config_api';

export function isLiveMode() {
  return API_CONFIG.MODE === 'live';
}

export async function fetchVendors() {
  const res = await fetch('/api/vendors');
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch('/api/orders');
  return res.json();
}

