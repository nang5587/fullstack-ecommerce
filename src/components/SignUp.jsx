// 훅 목록
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 애니메이션 효과
import { motion, AnimatePresence } from 'framer-motion';

// Icon 목록
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function SignUp() {
    const navigate = useNavigate();

    // 1. 진행 단계와 폼 데이터를 관리하는 state
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nickname: '',
        gender: '', // 사용자가 선택하지 않으면 빈 문자열로 전송
        birth: '',
        email: '',
        phone: '',
    });
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. 입력값 변경을 처리하는 핸들러
    const handleChange = (e) => {
        if (errorMsg) setErrorMsg('');
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. 다음 단계로 넘어가는 핸들러 (유효성 검사 포함)
    const handleNextStep = () => {
        // 간단한 유효성 검사
        if (!formData.username || !formData.password || !formData.nickname || !formData.birth) {
            setErrorMsg('필수 정보를 모두 입력해주세요.');
            return;
        }
        if (formData.password !== passwordConfirm) {
            setErrorMsg('비밀번호가 일치하지 않습니다.');
            return;
        }
        setErrorMsg('');
        // 모든 검사를 통과하면 다음 단계로
        setStep(step + 1);
    };

    // 4. 최종 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        if (!formData.email || !formData.phone) {
            setErrorMsg('이메일과 휴대폰 번호를 입력해주세요.');
            setIsSubmitting(false);
            return;
        }
        const rawPhoneNumber = formData.phone.replace(/-/g, ''); // 혹시 사용자가 하이픈을 넣었을 경우를 대비해 먼저 제거

        // 2. 정규식을 사용해 하이픈을 자동으로 추가합니다.
        let formattedPhoneNumber = rawPhoneNumber;
        if (rawPhoneNumber.length === 11) {
            // 010-1234-5678 형식
            formattedPhoneNumber = rawPhoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (rawPhoneNumber.length === 10) {
            // 010-123-4567 형식 또는 지역번호
            formattedPhoneNumber = rawPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }

        // 백엔드에 보낼 데이터 구성
        const payload = {
            ...formData,
            phone: formattedPhoneNumber,
            role: 'ROLE_MEMBER', // 일반 사용자는 ROLE_USER, 관리자는 별도 처리
        };
        console.log("백엔드로 전송될 JSON 데이터:", payload);

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.post(`http://${baseUrl}/api/public/join`, payload);

            // 성공 시 페이지 이동
            navigate('/signup-success');

        } catch (error) {
            console.error('회원가입 실패:', error);
            // 서버에서 받은 에러 메시지를 사용자에게 보여줄 수 있습니다.
            setErrorMsg(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
            console.error("Axios 에러 상세 정보:", error);

            // 2. error.response가 있는지 확인하는 것이 매우 중요합니다.
            if (error.response) {
                // 서버가 응답을 했지만, 상태 코드가 2xx가 아닌 경우 (예: 400, 404, 500)
                console.error("서버 응답 데이터:", error.response.data);
                console.error("서버 응답 상태:", error.response.status);
                setErrorMsg(error.response.data?.message || `서버 오류가 발생했습니다. (코드: ${error.response.status})`);
            } else if (error.request) {
                // 요청이 이루어졌지만 응답을 받지 못한 경우 (네트워크 오류, CORS 등)
                console.error("요청은 보냈으나 응답을 받지 못함:", error.request);
                setErrorMsg('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
            } else {
                // 요청을 설정하는 중에 에러가 발생한 경우
                console.error('요청 설정 에러:', error.message);
                setErrorMsg('요청을 보내는 중 문제가 발생했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 애니메이션 Variant
    const slideAnimation = {
        initial: { opacity: 0, height: 0, marginTop: 0 },
        animate: { opacity: 1, height: 'auto', marginTop: '1.5rem' },
        exit: { opacity: 0, height: 0, marginTop: 0 },
        transition: { duration: 0.4, ease: 'easeInOut' }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- 1단계: 기본 정보 --- */}
                    <input type="text" name="username" placeholder="아이디" value={formData.username} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-md" />
                    <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-md" />
                    <input type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required className="w-full p-3 border border-gray-200 rounded-md" />
                    <input type="text" name="nickname" placeholder="이름(닉네임)" value={formData.nickname} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-md" />
                    <div className="flex items-center space-x-4">
                        <label className="text-gray-600">성별</label>
                        <label><input type="radio" name="gender" value="MALE" checked={formData.gender === 'MALE'} onChange={handleChange} className="mr-1" />남성</label>
                        <label><input type="radio" name="gender" value="FEMALE" checked={formData.gender === 'FEMALE'} onChange={handleChange} className="mr-1" />여성</label>
                    </div>
                    <input type="date" name="birth" value={formData.birth} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-md text-gray-500" />

                    <div className={`transition-all duration-300 ${errorMsg ? 'opacity-100' : 'opacity-0 h-0 invisible'}`}>
                        {errorMsg && (
                            <div className="p-3 flex items-center gap-3 text-sm rounded-lg bg-red-50 text-red-700">
                                <FontAwesomeIcon icon={faCircleExclamation} />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                    </div>

                    {/* 다음 단계 버튼 (1단계에서만 보임) */}
                    {step === 1 && (
                        <button type="button" onClick={handleNextStep} className="w-full bg-kalani-gold text-white font-bold py-3 rounded-md hover:opacity-90 transition-opacity">
                            다음
                        </button>
                    )}

                    {/* --- 2단계: 이메일 (애니메이션 적용) --- */}
                    <AnimatePresence>
                        {step >= 2 && (
                            <motion.div {...slideAnimation} className="overflow-hidden">
                                <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                                {step === 2 && (
                                    <button type="button" onClick={() => setStep(3)} className="w-full mt-6 bg-kalani-gold text-white font-bold py-3 rounded-md hover:opacity-90 transition-opacity">
                                        다음
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* --- 3단계: 휴대폰 번호 및 최종 제출 (애니메이션 적용) --- */}
                    <AnimatePresence>
                        {step >= 3 && (
                            <motion.div {...slideAnimation} className="overflow-hidden">
                                <input type="tel" name="phone" placeholder="휴대폰 번호 ('-' 제외)" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                                <button type="submit" disabled={isSubmitting} className="w-full mt-6 bg-kalani-navy text-white font-bold py-3 rounded-md hover:opacity-90 transition-opacity disabled:bg-gray-400">
                                    {isSubmitting ? '가입 처리 중...' : '가입하기'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}