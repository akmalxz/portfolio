import { useCallback, useState } from 'react';
import { AmbientBackground } from './components/AmbientBackground';
import { BedroomCorner } from './components/BedroomCorner';
import { BookModal } from './components/BookModal';
import { Header } from './components/Header';
import { PcModal, type RoomSectionTab } from './components/PcModal';
import { BOOKS } from './data/books';
import { PROFILE } from './data/profile';
import type { BookEntry } from './types/library';

export function App() {
  const [selectedBook, setSelectedBook] = useState<BookEntry | null>(null);
  const [activeSection, setActiveSection] = useState<RoomSectionTab | null>(
    null,
  );

  const handleCloseBook = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link visually-hidden">
        Skip to main content
      </a>

      <AmbientBackground />

      <div className="page-shell">
        <Header profile={PROFILE} />

        <main id="main-content" className="library-main">
          <BedroomCorner
            profile={PROFILE}
            books={BOOKS}
            activeSection={activeSection}
            selectedBook={selectedBook}
            onSelectBook={setSelectedBook}
            onOpenSection={setActiveSection}
          />
        </main>
      </div>

      <BookModal
        book={selectedBook}
        books={BOOKS}
        onClose={handleCloseBook}
      />
      <PcModal
        activeTab={activeSection}
        profile={PROFILE}
        onClose={handleCloseSection}
      />
    </>
  );
}

export default App;
