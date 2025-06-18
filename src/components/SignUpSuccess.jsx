import { Link } from 'react-router-dom';

export default function SignUpSuccess() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-10 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-kalani-gold mb-4">🎉 환영합니다!</h1>
                <p className="text-gray-600 mb-6">회원가입이 성공적으로 완료되었습니다.</p>
                <Link
                    to="/login"
                    className="w-full bg-kalani-navy text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity"
                >
                    로그인하러 가기
                </Link>
            </div>
        </div>
    );
}