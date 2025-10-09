<template>
  <div class="dashboard">
    <aside class="dashboard__sidebar">
      <h2 class="dashboard__logo">Admin Panel</h2>

      <nav class="dashboard__nav">
        <NuxtLink to="/dashboard/users" class="dashboard__link">Users</NuxtLink>
        <NuxtLink to="/dashboard/finance" class="dashboard__link">Finance</NuxtLink>
        <NuxtLink to="/dashboard/reports" class="dashboard__link">Reports</NuxtLink>
        <NuxtLink to="/dashboard/analytics" class="dashboard__link">Analytics</NuxtLink>
        <NuxtLink to="/dashboard/settings" class="dashboard__link">Settings</NuxtLink>
      </nav>
    </aside>

    <section class="dashboard__main">
      <header class="dashboard__header">
        <h1 class="dashboard__title">Dashboard</h1>
        <button class="dashboard__logout">Logout</button>
      </header>

      <main class="dashboard__content">
        <slot />
      </main>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.dashboard__nav {
    font-family: var(--font-base);
    color: #374151;
}

/* --- Sidebar --- */
.dashboard__sidebar {
  width: 240px;
  background: linear-gradient(180deg, #59c080, #4fadbe);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.dashboard__logo {
  font-family: var(--font-base);
  font-weight: 700;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard__nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dashboard__link {
  font: var(--font-base);
  color: white;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  transition: background 0.2s;
}

.dashboard__link:hover,
.dashboard__link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

/* --- Main Area --- */
.dashboard__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dashboard__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
}

.dashboard__logout {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  border: none;
  color: white;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.dashboard__logout:hover {
  opacity: 0.9;
}

.dashboard__content {
  flex: 1;
  padding: 2rem;
}
</style>
