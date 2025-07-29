import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'type-fire': 'hsl(var(--type-fire))',
				'type-water': 'hsl(var(--type-water))',
				'type-grass': 'hsl(var(--type-grass))',
				'type-electric': 'hsl(var(--type-electric))',
				'type-psychic': 'hsl(var(--type-psychic))',
				'type-ice': 'hsl(var(--type-ice))',
				'type-dragon': 'hsl(var(--type-dragon))',
				'type-dark': 'hsl(var(--type-dark))',
				'type-fighting': 'hsl(var(--type-fighting))',
				'type-poison': 'hsl(var(--type-poison))',
				'type-ground': 'hsl(var(--type-ground))',
				'type-flying': 'hsl(var(--type-flying))',
				'type-bug': 'hsl(var(--type-bug))',
				'type-rock': 'hsl(var(--type-rock))',
				'type-ghost': 'hsl(var(--type-ghost))',
				'type-steel': 'hsl(var(--type-steel))',
				'type-normal': 'hsl(var(--type-normal))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-slow': 'bounce 2s infinite',
				'pulse-slow': 'pulse 3s infinite'
			},
			backgroundImage: {
				'gradient-pokemon': 'var(--gradient-pokemon)',
				'gradient-card': 'var(--gradient-card)'
			},
			boxShadow: {
				'pokemon': 'var(--shadow-pokemon)',
				'card-hover': 'var(--shadow-card)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
