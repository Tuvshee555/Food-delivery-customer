// components/cartStep/styles.ts

export const classes = {
  /* PAGE */
  page: `
    min-h-screen
    bg-background
    text-foreground
    pt-[110px]
    pb-20
  `,

  /* LAYOUT */
  wrapper: `
    max-w-7xl mx-auto
    px-4 sm:px-6 md:px-10
    grid grid-cols-1
    lg:grid-cols-[1fr_360px]
    gap-8
    items-start
  `,

  /* LEFT (CART ITEMS) */
  leftCard: `
    bg-background
    border border-border
    rounded-lg
    p-4 sm:p-6
  `,

  /* RIGHT (SUMMARY) */
  rightCard: `
    bg-background
    border border-border
    rounded-lg
    p-4 sm:p-6
    h-fit
    sticky top-[120px]
  `,

  /* CART ITEM ROW */
  itemRow: `
    flex items-start
    gap-4
    py-4
    border-b border-border
    last:border-b-0
  `,

  /* PRODUCT IMAGE */
  img: `
    w-20 h-20
    rounded-md
    border border-border
    object-cover
    flex-shrink-0
  `,

  /* QUANTITY CONTROL */
  qtyControl: `
    flex items-center
    border border-border
    rounded-md
    overflow-hidden
  `,

  /* QUANTITY VALUE */
  qtyBadge: `
    min-w-[32px]
    text-center
    text-sm
    font-medium
    text-foreground
  `,

  /* EMPTY STATE */
  empty: `
    text-muted-foreground
    text-center
    py-16
    text-sm
  `,
};
