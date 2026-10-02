import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { catalogItem, category } from './schema.ts';

type SeedItem = { name: string; baseQuantity: number; perDay: number | null; max: number | null };

const fixed = (name: string, baseQuantity = 1): SeedItem => ({
	name,
	baseQuantity,
	perDay: null,
	max: null
});

const daily = (name: string, perDay: number, max: number | null = null): SeedItem => ({
	name,
	baseQuantity: 1,
	perDay,
	max
});

const catalog: Record<string, SeedItem[]> = {
	Basics: [
		fixed('Passport/ID'),
		fixed('Wallet'),
		fixed('Phone'),
		fixed('Phone charger'),
		fixed('Keys'),
		fixed('Travel insurance docs'),
		fixed('Tickets/booking confirmations'),
		fixed('Credit/debit card'),
		fixed('Cash'),
		fixed('Reusable water bottle'),
		fixed('Sunglasses'),
		fixed('Daypack')
	],
	Clothing: [
		daily('T-shirts', 1, 7),
		daily('Underwear', 1, 8),
		daily('Socks', 1, 8),
		daily('Pants/trousers', 0.3, 3),
		daily('Shorts', 0.3, 3),
		fixed('Sweater/hoodie'),
		fixed('Light jacket'),
		daily('Pajamas', 0.15, 2),
		fixed('Belt'),
		fixed('Casual shoes'),
		fixed('Flip-flops'),
		fixed('Swimwear'),
		fixed('Cap/hat')
	],
	'Cold Weather': [
		fixed('Winter jacket'),
		daily('Thermal base layer', 0.3, 3),
		daily('Warm socks', 1, 5),
		fixed('Beanie'),
		fixed('Gloves'),
		fixed('Scarf'),
		fixed('Winter boots'),
		fixed('Fleece')
	],
	'Hygiene & Cleaning': [
		fixed('Toothbrush'),
		fixed('Toothpaste'),
		fixed('Floss'),
		fixed('Deodorant'),
		fixed('Shampoo'),
		fixed('Shower gel/soap'),
		fixed('Hairbrush/comb'),
		fixed('Razor'),
		fixed('Nail clipper'),
		fixed('Sunscreen'),
		fixed('Lip balm'),
		fixed('Hand sanitizer'),
		fixed('Wet wipes'),
		fixed('Tissues'),
		fixed('Toilet paper'),
		daily('Contact lenses', 1, 30),
		fixed('Laundry bag'),
		fixed('Travel detergent'),
		fixed('Microfiber towel')
	],
	'Health & First Aid': [
		daily('Personal medication', 1),
		fixed('Painkillers'),
		fixed('Band-aids'),
		fixed('Blister plasters'),
		fixed('Disinfectant'),
		fixed('Insect repellent'),
		fixed('Antihistamines'),
		fixed('Motion-sickness pills'),
		fixed('Tick tweezers'),
		fixed('Thermometer')
	],
	Electronics: [
		fixed('Power bank'),
		fixed('Charging cables', 2),
		fixed('Travel adapter'),
		fixed('Headphones'),
		fixed('E-reader'),
		fixed('Laptop + charger'),
		fixed('Camera'),
		fixed('Memory cards', 2),
		fixed('Spare batteries')
	],
	Camping: [
		fixed('Tent'),
		fixed('Sleeping bag'),
		fixed('Sleeping pad'),
		fixed('Camping pillow'),
		fixed('Headlamp'),
		fixed('Lantern'),
		fixed('Camping stove'),
		daily('Gas canister', 0.3, 4),
		fixed('Lighter/matches', 2),
		fixed('Cookware set'),
		fixed('Cutlery/spork'),
		fixed('Mug'),
		fixed('Plates/bowls'),
		fixed('Dish sponge'),
		fixed('Biodegradable soap'),
		fixed('Trash bags', 3),
		fixed('Cooler box'),
		fixed('Camping chair'),
		fixed('Tarp'),
		fixed('Rope/paracord'),
		fixed('Multi-tool'),
		fixed('Water filter'),
		fixed('Tent repair kit'),
		fixed('Mallet')
	],
	Hiking: [
		fixed('Hiking boots'),
		daily('Hiking socks', 1, 5),
		fixed('Backpack'),
		fixed('Rain jacket'),
		fixed('Rain cover'),
		fixed('Trekking poles'),
		fixed('Map/offline maps'),
		fixed('Compass'),
		fixed('Hydration bladder'),
		daily('Snacks/energy bars', 2),
		fixed('Emergency blanket'),
		fixed('Whistle'),
		fixed('Sun hat'),
		daily('Quick-dry shirt', 0.5, 3)
	],
	Beach: [
		fixed('Beach towel'),
		fixed('Swimwear', 2),
		fixed('Beach bag'),
		fixed('After-sun lotion'),
		fixed('Snorkel set'),
		fixed('Beach umbrella'),
		fixed('Waterproof phone pouch'),
		fixed('Water shoes')
	],
	Business: [
		fixed('Suit/blazer'),
		daily('Dress shirts', 1, 5),
		fixed('Dress shoes'),
		fixed('Tie'),
		fixed('Business cards'),
		fixed('Notebook & pen'),
		fixed('Laptop bag')
	],
	'Winter Sports': [
		fixed('Ski jacket'),
		fixed('Ski pants'),
		fixed('Ski goggles'),
		fixed('Helmet'),
		fixed('Ski gloves'),
		fixed('Neck gaiter'),
		daily('Ski socks', 1, 5),
		daily('Hand warmers', 1)
	],
	'Travel Comfort': [
		fixed('Neck pillow'),
		fixed('Eye mask'),
		fixed('Earplugs'),
		fixed('Book'),
		fixed('Travel snacks'),
		fixed('Pen (for forms)'),
		fixed('Luggage lock'),
		fixed('Luggage tags')
	],
	Kids: [
		daily('Diapers', 6),
		fixed('Baby wipes'),
		daily("Kids' clothes", 2, 10),
		fixed('Favorite toy'),
		daily("Kids' snacks", 1),
		fixed("Kids' sunscreen"),
		fixed('Stroller'),
		fixed("Kids' medication")
	],
	Pets: [
		daily('Pet food', 1),
		fixed('Food & water bowls'),
		fixed('Leash'),
		daily('Poop bags', 1),
		fixed('Pet bed/blanket'),
		fixed('Pet vaccination papers'),
		fixed('Pet toys')
	]
};

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const db = drizzle(createClient({ url }));

if (await db.$count(category)) {
	console.log('Catalog already has categories, skipping seed.');
} else {
	await db.transaction(async (tx) => {
		for (const [sortOrder, [name, items]] of Object.entries(catalog).entries()) {
			const [{ id }] = await tx
				.insert(category)
				.values({ name, sortOrder })
				.returning({ id: category.id });
			await tx.insert(catalogItem).values(items.map((item) => ({ ...item, categoryId: id })));
		}
	});
	console.log(`Seeded ${Object.keys(catalog).length} categories.`);
}
