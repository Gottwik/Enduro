# Kiskabricks_wedgecss
Wedgecss is a set of simple css stylesheet classes designed to add vertical whitespace to projects.

See compiled version [here](http://www.sassmeister.com/gist/eb20b9ae092b8f4aefe12ee4c54a3584).

## Dependencies
Wedgecss uses media queries from bootstrap 4 but these are included for your convenience. Only a sass compiler is needed to make this work.

## Basic wedges
`.wedge` - Will create 10px high horizontal stripe of whitespace

`.subwedge` - Will create 10px negative space

## Multiple wedges
Multiple wedges go up to 8x

`wedge-5x` - will create 50px high horizontal space

`.subwedge-5x` - Will create 50px negative space

## Responsive wedges
responsive wedges share bootstrap media breakpoints list, but you can override it before importing wedgecss with this code:

```scss
$grid-breakpoints: (
	xs: 0,
	sm: 544px,
	md: 768px,
	lg: 992px,
	xl: 1280px
);
```

`wedge-sm-down` - will create wedge only visible on sm screens and down

`subwedge-md-up-4x` - will create wedge only visible on sm screens and down


## Half-wedge
`half-wedge` - will create a 5px high whitespace

## Size
Gzipped 1,46kb
