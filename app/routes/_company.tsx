import { Outlet } from 'react-router'
import { CompanyFooter } from '~/components/company-footer'
import { CompanyHeader } from '~/components/company-header'

export default function layout() {
  return (
    <>
      <CompanyHeader />
      <Outlet />
      <CompanyFooter />
    </>
  )
}
