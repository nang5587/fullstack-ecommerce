// 훅 목록
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 애니메이션 효과
import { motion, AnimatePresence } from 'framer-motion';

// Icon 목록
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FiEye, FiEyeOff } from 'react-icons/fi';

// UI 목록
import BirthdayPicker from '../UI/BirthdayPicker';

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
    const [usernameCheckMsg, setUsernameCheckMsg] = useState('');
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // null: 검사 안함, true/false 검사결과
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [birth, setBirth] = useState('');

    const baseUrl = import.meta.env.VITE_BACKEND_URL;

    // 2. 입력값 변경을 처리하는 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'username') {
            setUsernameCheckMsg('');
            setIsUsernameAvailable(null);
        }
        if (name === 'phone') {
            const onlyNums = value.replace(/\D/g, '');

            if (onlyNums.length <= 3) {
                newValue = onlyNums;
            } else if (onlyNums.length <= 7) {
                newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
            } else if (onlyNums.length <= 11) {
                newValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
            } else {
                newValue = onlyNums.slice(0, 11); // 초과 입력 제한
            }
        }

        if (errorMsg) setErrorMsg('');
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    useEffect(() => {
        if (!formData.username.trim()) return;

        const delayDebounce = setTimeout(() => {
            checkUsername();
        }, 600);

        return () => clearTimeout(delayDebounce);
    }, [formData.username]);

    const checkUsername = async () => {
        setIsCheckingUsername(true);
        try {
            const response = await axios.post(`http://${baseUrl}/api/public/join/idsearch`, {
                username: formData.username.trim()
            }, {});
            // const response = await axios.get(`http://${baseUrl}/api/public/join/idsearch?username=${formData.username}`)
            console.log('넘어오는 상태: ', response.status);

            if (response.status === 409) {
                setUsernameCheckMsg('이미 사용 중인 아이디입니다.');
                setIsUsernameAvailable(false);
            } else {
                setUsernameCheckMsg('사용 가능한 아이디입니다.');
                setIsUsernameAvailable(true);
            }
        } catch (error) {
            setUsernameCheckMsg('아이디 중복 확인 중 오류가 발생했습니다.');
            setIsUsernameAvailable(false);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    useEffect(() => {
        if (
            formData.username &&
            formData.password &&
            passwordConfirm &&
            formData.nickname &&
            formData.birth &&
            isUsernameAvailable &&
            formData.password === passwordConfirm
        ) {
            setStep(2);
        }
    }, [formData, passwordConfirm, isUsernameAvailable]);

    useEffect(() => {
        if (step === 2 & formData.email.includes('@')) {
            setStep(3);
        }
    }, [formData.email, step])

    // 4. 최종 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

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
            birth: formData.birth ? formData.birth.toString().slice(0, 10) : '',
            phone: formattedPhoneNumber,
            role: 'ROLE_MEMBER', // 일반 사용자는 ROLE_USER, 관리자는 별도 처리
        };
        console.log("백엔드로 전송될 JSON 데이터:", payload);

        try {
            await axios.post(`http://${baseUrl}/api/public/join`, payload);
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
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.4, ease: 'easeInOut' }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-nm p-12">
                <h2 id='font3' className="text-kalani-navy text-2xl font-bold text-center mb-10">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- 1단계: 기본 정보 --- */}
                    <input type="text" name="username" placeholder="아이디" value={formData.username} onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-md focus-within:outline-kalani-gold focus-within:outline-2" />
                    {usernameCheckMsg && (
                        <p
                            className={`mt-1 text-sm ${isUsernameAvailable ? 'text-kalani-success' : 'text-kalani-error'
                                }`}
                        >
                            {isUsernameAvailable ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faCircleExclamation} />}
                            &nbsp;{usernameCheckMsg}
                        </p>
                    )}
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-md focus-within:outline-kalani-gold focus-within:outline-2" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-[35%] transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <FiEye /> : <FiEyeOff />}
                        </button>
                    </div>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="passwordConfirm" placeholder="비밀번호 확인" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required className="w-full p-3 border border-gray-200 rounded-md focus-within:outline-kalani-gold focus-within:outline-2" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-[35%] transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <FiEye /> : <FiEyeOff />}
                        </button>
                    </div>


                    {passwordConfirm.length > 0 && (
                        <p className={`text-sm mt-1 ${formData.password === passwordConfirm ? 'text-green-600' : 'text-red-600'}`}>
                            {formData.password === passwordConfirm ? (
                                <>
                                    <FontAwesomeIcon icon={faCircleCheck} /> 비밀번호가 일치합니다.
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCircleExclamation} /> 비밀번호가 일치하지 않습니다.
                                </>
                            )}
                        </p>
                    )}
                    <input type="text" name="nickname" placeholder="이름" value={formData.nickname} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-md focus-within:outline-kalani-gold focus-within:outline-2" />
                    <div className="flex items-center space-x-4">
                        <label className="text-gray-600">성별</label>
                        <label><input type="radio" name="gender" value="MALE" checked={formData.gender === 'MALE'} onChange={handleChange} className="mr-1" />남성</label>
                        <label><input type="radio" name="gender" value="FEMALE" checked={formData.gender === 'FEMALE'} onChange={handleChange} className="mr-1" />여성</label>
                    </div>
                    <div className='w-full flex flex-col justify-start'>
                        <BirthdayPicker
                            selected={formData.birth}
                            onChange={(date) => setFormData(prev => ({ ...prev, birth: date }))}
                        />

                        {birth && <p>선택된 생일: {birth.toLocaleDateString()}</p>}
                        {/* <input type="date" name="birth" value={formData.birth} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-md text-gray-500 focus-within:outline-kalani-gold focus-within:outline-2" /> */}
                    </div>
                    {errorMsg && (
                        <div className="p-3 flex items-center gap-3 text-sm rounded-lg bg-red-50 text-red-700">
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* --- 2단계: 이메일 (애니메이션 적용) --- */}
                    <AnimatePresence>
                        {step >= 2 && (
                            <motion.div {...slideAnimation}>
                                <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-md" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* --- 3단계: 휴대폰 번호 및 최종 제출 (애니메이션 적용) --- */}
                    <AnimatePresence>
                        {step >= 3 && (
                            <motion.div {...slideAnimation}>
                                <input type="tel" name="phone" placeholder="휴대폰 번호" value={formData.phone} onChange={handleChange}
                                    className="w-full p-3 border border-gray-200 rounded-md" />
                                <button type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-6 bg-kalani-navy text-white font-bold py-3 rounded-md hover:bg-kalani-gold disabled:bg-gray-400">
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