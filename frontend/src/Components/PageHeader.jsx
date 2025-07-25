import { ArrowLeft } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import PropTypes from "prop-types"

const PageHeader = ({ title, buttonText, onButtonClick }) => {
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        {!isHomePage && (
          <Link to="/" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {isHomePage ? (
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="mr-4 px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500"
          />
          <Link
            to="/add-entry"
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Add logbook entry
          </Link>
        </div>
      ) : (
        <button
          onClick={onButtonClick}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
}

PageHeader.defaultProps = {
  buttonText: "Save",
  onButtonClick: () => {},
}

export default PageHeader