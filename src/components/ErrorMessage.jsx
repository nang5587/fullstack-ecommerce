// components/ErrorMessage.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function ErrorMessage({ errorMsg }) {
    if (!errorMsg) return null;

    return (
        <div className="transition-all duration-300 mt-4 px-4 py-3 flex justify-between items-center gap-5 text-sm rounded-lg bg-kalani-creme text-gray-700">
            <span>
                <FontAwesomeIcon icon={faCircleExclamation} className="mr-2 text-kalani-navy" />
                {errorMsg}
            </span>
        </div>
    );
}
