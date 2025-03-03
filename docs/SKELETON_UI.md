# Skeleton UI Components

This document explains how to use the skeleton UI components in the Lystly app to create loading states that improve user experience.

## Overview

Skeleton screens are placeholder UI elements that mimic the layout of content while it's loading. They provide several benefits:

- Reduce perceived loading time
- Set expectations about the content that will appear
- Prevent layout shifts when content loads
- Create a smoother, more polished user experience

The Lystly app includes a set of skeleton components optimized for both light and dark mode, with appropriate contrast levels and subtle animations.

## Available Components

### Basic Skeleton

The most fundamental building block for creating skeleton UIs:

```tsx
import { Skeleton } from '@/components/SkeletonUI';

// Basic usage
<Skeleton width={100} height={20} />

// Custom styling
<Skeleton 
  width="80%" 
  height={40} 
  borderRadius={8}
  style={{ marginBottom: 16 }} 
/>

// Disable shimmer effect
<Skeleton width={100} height={20} shimmerEnabled={false} />
```

### Text Skeleton

For representing text content with multiple lines:

```tsx
import { TextSkeleton } from '@/components/SkeletonUI';

// Basic usage
<TextSkeleton />

// Customize number of lines and spacing
<TextSkeleton 
  lines={4} 
  lineHeight={18} 
  spacing={10} 
/>

// Control the width of the last line
<TextSkeleton lastLineWidth="40%" />
```

### List Item Skeleton

For representing items in a list:

```tsx
import { ListItemSkeleton } from '@/components/SkeletonUI';

// Basic usage
<ListItemSkeleton />

// Customize image size and shape
<ListItemSkeleton 
  imageSize={80} 
  imageShape="circle" 
/>

// Customize number of text lines
<ListItemSkeleton lines={3} />
```

### Card Skeleton

For representing card-based content:

```tsx
import { CardSkeleton } from '@/components/SkeletonUI';

// Basic usage
<CardSkeleton />

// Customize image height and text lines
<CardSkeleton 
  imageHeight={150} 
  lines={4} 
/>
```

## Dark Mode Optimization

The skeleton components are designed to work well in both light and dark modes:

- In light mode, skeletons use a subtle gray color with a slightly darker shimmer
- In dark mode, skeletons use a very subtle light color with a slightly brighter shimmer

This ensures that the contrast is appropriate in both modes, avoiding the common issue of skeletons being too bright and jarring in dark mode.

## Usage Patterns

### Loading Lists

```tsx
function ItemList({ isLoading, items }) {
  if (isLoading) {
    return (
      <View>
        {Array.from({ length: 5 }).map((_, index) => (
          <ListItemSkeleton key={index} />
        ))}
      </View>
    );
  }
  
  return (
    <View>
      {items.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </View>
  );
}
```

### Loading Cards

```tsx
function CardGrid({ isLoading, cards }) {
  if (isLoading) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </View>
    );
  }
  
  return (
    <View style={styles.grid}>
      {cards.map(card => (
        <CardComponent key={card.id} card={card} />
      ))}
    </View>
  );
}
```

### Custom Layouts

For more complex layouts, you can combine the basic skeleton components:

```tsx
function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Skeleton 
          width={80} 
          height={80} 
          borderRadius={40} 
        />
        <View style={styles.headerText}>
          <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
          <Skeleton width={100} height={16} />
        </View>
      </View>
      
      {/* Stats */}
      <View style={styles.stats}>
        <Skeleton width="30%" height={40} />
        <Skeleton width="30%" height={40} />
        <Skeleton width="30%" height={40} />
      </View>
      
      {/* Content */}
      <TextSkeleton lines={4} />
    </View>
  );
}
```

## Best Practices

1. **Match the actual content layout** - Skeleton screens should closely resemble the layout of the content they're replacing.

2. **Use appropriate sizing** - Size skeleton elements to match the expected size of the content.

3. **Consider content hierarchy** - Use different sizes for different levels of content (headings, body text, etc.).

4. **Don't overuse animations** - The shimmer effect should be subtle and not distracting.

5. **Test in both themes** - Always verify that your skeleton screens look good in both light and dark mode.

6. **Avoid layout shifts** - Ensure that the skeleton layout matches the final content layout to prevent jarring transitions.

7. **Use consistent timing** - Try to show skeletons for a minimum amount of time (around 300-500ms) even if data loads faster, to prevent flickering.

## Example Implementation

See `components/SkeletonExample.tsx` for a complete example of how to use the skeleton components in various scenarios.

## Performance Considerations

- Skeleton screens should be lightweight and not cause performance issues
- For very long lists, consider using a FlatList with skeleton items
- Avoid creating too many animated elements at once

## Accessibility

- Skeleton screens should be announced to screen readers as "Loading content"
- Use appropriate ARIA roles and labels in web contexts
- Consider disabling animations for users who have requested reduced motion 