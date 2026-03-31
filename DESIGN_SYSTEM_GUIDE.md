# UI Design System & Component Guide

## Quick Start Guide

### Using the Component Library

All components are exported from `src/components/ui/index.jsx`:

```jsx
import { 
  StatusBadge, 
  JobCard, 
  ConfirmModal,
  LoadingSpinner,
  EmptyState,
  JobTable,
  FilterBar,
  Button,
  Card,
  Input
} from "../components/ui";
```

---

## Color Palette

### Primary Colors
- **Indigo**: `#4f46e5` (primary actions, links)
- **Blue**: `#0ea5e9` (secondary, info)
- **Emerald**: `#10b981` (success, completed)

### Status Colors
- **Pending**: Amber `#f59e0b` (clock icon)
- **Printing**: Blue `#0ea5e9` (lightning icon)
- **Completed**: Emerald `#10b981` (checkmark icon)
- **Failed**: Red `#ef4444` (alert icon)
- **Deleted**: Gray `#6b7280` (trash icon)

### Neutral Palette
- **Background**: Light gray `#f9fafb`
- **Surface**: White `#ffffff`
- **Border**: Slate `#e2e8f0`
- **Text**: Dark gray `#111827`
- **Text Muted**: Slate `#64748b`

---

## Component Examples

### 1. StatusBadge

```jsx
// Basic usage
<StatusBadge status="completed" size="md" />

// Sizes: sm, md, lg
<StatusBadge status="pending" size="sm" />
<StatusBadge status="printing" size="lg" />

// Auto-detect status with NFC (normalized from DB)
<StatusBadge status={job.status.toLowerCase()} />
```

### 2. JobCard

```jsx
<JobCard 
  job={job}
  onDelete={(id) => deleteJob(id)}
  onView={(id) => viewJob(id)}
  showUser={true}
/>
```

### 3. ConfirmModal

```jsx
const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

<ConfirmModal
  isOpen={deleteModal.isOpen}
  title="Delete Print Job"
  message="Are you sure? This cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  type="danger" // warning | danger | info
  isLoading={deleting}
  onConfirm={() => deleteJob(deleteModal.id)}
  onCancel={() => setDeleteModal({ isOpen: false, id: null })}
/>
```

### 4. LoadingSpinner

```jsx
// Inline spinner with message
<LoadingSpinner size="md" message="Loading jobs..." />

// Full-page overlay
<LoadingSpinner fullPage={true} />

// Just the spinner
<LoadingSpinner size="sm" />

// Card skeleton placeholders
<CardSkeleton />
<CardSkeleton />
```

### 5. EmptyState

```jsx
<EmptyState type="jobs" />
<EmptyState type="search" title="No results" message="Try different keywords" />
<EmptyState type="error" />
```

### 6. JobTable

```jsx
<JobTable
  jobs={filteredJobs}
  showUser={true}
  isLoading={loading}
  onDelete={handleDelete}
  onUpdate={handleUpdate}
  onView={handleView}
  actions={["view", "edit", "delete"]} // which action buttons to show
/>
```

### 7. FilterBar

```jsx
<FilterBar
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  selectedFilter={filter}
  onFilterChange={setFilter}
  filters={[
    { value: "all", label: "All Jobs" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ]}
  clearable={true}
/>
```

---

## Responsive Grid Classes

Use Tailwind's responsive classes for layouts:

```jsx
// Two-column grid on mobile, responsive larger screens
<div className="responsive-grid">
  {/* items */}
</div>

// Responsive 2-column grid
<div className="responsive-grid-2">
  {/* items */}
</div>

// Custom responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* items */}
</div>
```

---

## CSS Utility Classes

### Buttons

```html
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<button className="btn-danger">Delete</button>
<button className="btn-ghost">Cancel</button>
```

### Cards

```html
<!-- Basic card -->
<div className="card">Content here</div>

<!-- Hoverable card -->
<div className="card-hover">Click me</div>
```

### Forms

```html
<input className="input-field" placeholder="Type here...">
<textarea className="textarea-field"></textarea>
<select className="select-field">
  <option>Option 1</option>
</select>
```

### Tables

```html
<table>
  <thead>
    <th className="table-header">Column 1</th>
  </thead>
  <tbody>
    <tr className="table-row-hover">
      <td className="table-cell">Data</td>
    </tr>
  </tbody>
</table>
```

### Alerts

```html
<div className="alert-success">✓ Success!</div>
<div className="alert-warning">⚠ Warning!</div>
<div className="alert-danger">✕ Error!</div>
<div className="alert-info">ℹ Info</div>
```

### Badges

```html
<span className="badge-success">Completed</span>
<span className="badge-warning">Pending</span>
<span className="badge-danger">Failed</span>
<span className="badge-info">Info</span>
```

---

## Animation Classes

```jsx
// Fade in from bottom
<div className="fade-in-up">Content</div>

// Fade in
<div className="fade-in">Content</div>

// Slide in from left
<div className="slide-in-left">Content</div>

// Staggered animation for lists
<div className="stagger">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Hover lift effect
<div className="hover-lift">Hover me</div>

// Slow pulse
<div className="pulse-slow">Content</div>

// Shimmer loading animation
<div className="shimmer"></div>
```

---

## Common Usage Patterns

### Page Header

```jsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="page-header"
>
  <div className="flex items-center gap-3 mb-2">
    <div className="p-3 bg-indigo-100 rounded-lg">
      <Printer className="text-indigo-600" size={28} />
    </div>
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Manage print jobs</p>
    </div>
  </div>
</motion.div>
```

### Stats Cards Grid

```jsx
<div className="responsive-grid-2 lg:grid-cols-5 mb-8">
  {stats.map((stat, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-6 border border-white/60`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{stat.label}</p>
          <p className="text-4xl font-bold">{stat.value}</p>
        </div>
        <stat.icon size={24} opacity={0.3} />
      </div>
    </motion.div>
  ))}
</div>
```

### Modal with Actions

```jsx
const [modal, setModal] = useState({ isOpen: false, data: null });

<ConfirmModal
  isOpen={modal.isOpen}
  title="Confirm Action"
  message={`Are you sure?`}
  type="warning"
  confirmText="Proceed"
  isLoading={loading}
  onConfirm={async () => {
    setLoading(true);
    try {
      await action(modal.data);
      toast.success("Success!");
      setModal({ isOpen: false, data: null });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }}
  onCancel={() => setModal({ isOpen: false, data: null })}
/>
```

---

## Responsive Design Tips

1. **Mobile First**: Design for mobile, then add media queries
   ```jsx
   <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
   ```

2. **Hide/Show on Breakpoints**:
   ```jsx
   <div className="hidden lg:block">Desktop view</div>
   <div className="lg:hidden">Mobile view</div>
   ```

3. **Padding & Spacing**:
   ```jsx
   <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
   ```

4. **Font Sizes**:
   ```jsx
   <h1 className="text-2xl md:text-3xl lg:text-4xl">
   ```

---

## Performance Tips

1. **Use Skeletons for Loading**:
   ```jsx
   {loading ? <CardSkeleton /> : <Card data={data} />}
   ```

2. **Lazy Load Images**:
   ```jsx
   <img loading="lazy" src="..." alt="..." />
   ```

3. **Debounce Searches**:
   ```jsx
   const debouncedSearch = useMemo(
     () => debounce((val) => setSearch(val), 300),
     []
   );
   ```

4. **Minimize Re-renders**:
   ```jsx
   const memoizedJobs = useMemo(() => filterJobs(jobs), [jobs, filter]);
   ```

---

## Accessibility Checklist

- ✅ Use semantic HTML (`<button>`, `<input>`, `<form>`)
- ✅ Add alt text to images
- ✅ Use ARIA labels where needed
- ✅ Ensure color contrast ratios (WCAG AA)
- ✅ Make buttons at least 44x44px
- ✅ Support keyboard navigation
- ✅ Add focus indicators
- ✅ Support reduced motion

---

## Troubleshooting

### Component not rendering
- Check imports from `components/ui`
- Verify all required props are passed
- Check browser console for errors

### Styling looks wrong
- Verify Tailwind CSS is loaded
- Check for conflicting classes
- Use `!important` only as last resort
- Check theme context if using dark mode

### Animations not working
- Ensure Framer Motion is installed
- Check `initial` and `animate` props
- Verify `motion.div` instead of `div`
- Check prefers-reduced-motion settings

---

**Last Updated:** Latest UI Refactor  
**Tailwind Version:** v3+  
**Framer Motion Version:** v10+
