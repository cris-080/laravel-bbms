import { useEffect } from 'react';

export default function Modal({ children, show = false, maxWidth = '2xl', onClose = () => {} }) {
    const closeOnEscape = (e) => {
        if (e.key === 'Escape' && show) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', closeOnEscape);
        // Prevent background scrolling when modal is open
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.removeEventListener('keydown', closeOnEscape);
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) {
        return null;
    }

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth] || 'sm:max-w-2xl';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-0">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 transform transition-all" 
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            </div>

            {/* Modal Panel */}
            <div className={`bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full sm:mx-auto ${maxWidthClass} z-50`}>
                {children}
            </div>
        </div>
    );
}