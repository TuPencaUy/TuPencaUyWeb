import api from './apiLogic'
import { useTenantStore } from '@/store/tenant'

export default function siteLogic()
{

  function init()
  {
    useTenantStore().setCurrentTenant();

    validateSite();
  }

  async function getSite(tenant)
  {
    try
    {
      const response = await api().execute(`/site/${tenant}`, 'GET');
      return response.json();
    } catch (e)
    {
      return null;
    }
  }

  async function validateSite()
  {

    const tenant = useTenantStore().getCurrentTenant;
    if (!tenant) return;

    const site = await getSite(tenant);
    if (!site || site?.error || !site?.data)
    {
      window.location.href = import.meta.env.VITE_CENTRAL_DOMAIN;
    }
  }

  return {
    init,
    getSite,
  }
}
