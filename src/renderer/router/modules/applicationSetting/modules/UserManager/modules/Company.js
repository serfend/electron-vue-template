const router = {
  path: 'Company',
  component: () => import('@/views/usersManager/Company'),
  name: 'Company',
  meta: {
    title: 'application.setting.users.company',
    icon: 'homepage_fill'
  }
}

export default router
