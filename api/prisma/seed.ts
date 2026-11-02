import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data for a clean seed run
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'librarian@library.com',
      name: 'Head Librarian',
      role: Role.LIBRARIAN,
    },
  });

  const patronUser = await prisma.user.create({
    data: {
      email: 'patron@library.com',
      name: 'Book Enthusiast',
      role: Role.PATRON,
    },
  });

  // Create 4 Genres
  const sciFi = await prisma.genre.create({ data: { name: 'Science Fiction' } });
  const fantasy = await prisma.genre.create({ data: { name: 'Fantasy' } });
  const mystery = await prisma.genre.create({ data: { name: 'Mystery' } });
  const history = await prisma.genre.create({ data: { name: 'History' } });

  // Create 17 Books (exceeds the 15+ requirement) distributed across the 4 genres
  const booksData = [
    // Science Fiction (4 books)
    { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965, isbn: '978-0441172719', genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', publishedYear: 1984, isbn: '978-0441569595', genreId: sciFi.id },
    { title: 'Foundation', author: 'Isaac Asimov', publishedYear: 1951, isbn: '978-0553293357', genreId: sciFi.id },
    { title: 'Snow Crash', author: 'Neal Stephenson', publishedYear: 1992, isbn: '978-0553380958', genreId: sciFi.id },

    // Fantasy (4 books)
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, isbn: '978-0547928227', genreId: fantasy.id },
    { title: 'The Way of Kings', author: 'Brandon Sanderson', publishedYear: 2010, isbn: '978-0765326357', genreId: fantasy.id },
    { title: 'Name of the Wind', author: 'Patrick Rothfuss', publishedYear: 2007, isbn: '978-0756404748', genreId: fantasy.id },
    { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', publishedYear: 2006, isbn: '978-0765350381', genreId: fantasy.id },

    // Mystery (4 books)
    { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', publishedYear: 1902, isbn: '978-0140437867', genreId: mystery.id },
    { title: 'Gone Girl', author: 'Gillian Flynn', publishedYear: 2012, isbn: '978-0307588371', genreId: mystery.id },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', publishedYear: 2005, isbn: '978-0307454546', genreId: mystery.id },
    { title: 'Big Little Lies', author: 'Liane Moriarty', publishedYear: 2014, isbn: '978-0399167065', genreId: mystery.id },

    // History (5 books)
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', publishedYear: 2011, isbn: '978-0062316097', genreId: history.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', publishedYear: 1997, isbn: '978-0393317558', genreId: history.id },
    { title: 'A People’s History of the United States', author: 'Howard Zinn', publishedYear: 1980, isbn: '978-0062397348', genreId: history.id },
    { title: 'The Silk Roads', author: 'Peter Frankopan', publishedYear: 2015, isbn: '978-1101946336', genreId: history.id },
    { title: 'The Wright Brothers', author: 'David McCullough', publishedYear: 2015, isbn: '978-1501125102', genreId: history.id },
  ];

  for (const book of booksData) {
    await prisma.book.create({ data: book });
  }

  // Create a sample review (Stretch Goal)
  const sampleBook = await prisma.book.findFirst({ where: { title: 'Dune' } });
  if (sampleBook) {
    await prisma.review.create({
      data: {
        rating: 5,
        comment: 'An absolute masterpiece of science fiction world-building!',
        bookId: sampleBook.id,
        userId: patronUser.id,
      },
    });
  }

  console.log('✅ Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });