import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SEARCH / PROMPT FIELD
 * 
 * Prominent search input for destination search and direct access.
 * Fixed placeholder: "Vai pra onde?"
 */

const SearchField = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results or destination
      navigate(`/destinos?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Vai pra onde?"
          className="w-full h-12 pl-12 pr-4 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
        />
      </div>
    </form>
  );
};

export default SearchField;
