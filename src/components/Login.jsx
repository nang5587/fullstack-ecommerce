import TailInput from "../UI/TailInput";
import TailButton from "../UI/TailButton";

export default function Login() {
    return (
        <div className="w-full flex justify-center items-center bg-white" style={{ minHeight: 'calc(100vh - 15rem)' }}>
            <div className="w-full h-1/2 max-w-2xl bg-white shadow-lg rounded-xl p-10">
                <p className="font-bold text-gray-800 text-2xl text-center mb-8">로그인</p>

                <div className="flex flex-col gap-5">
                    <TailInput label="아이디" type="text" />
                    <TailInput label="비밀번호" type="password" />
                </div>

                <div className="flex justify-end gap-4 mt-3 text-sm text-gray-500 font-medium">
                    <a href="#" className="hover:underline">비밀번호 찾기</a>
                    <a href="#" className="hover:underline">아이디 찾기</a>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                    <TailButton caption="로그인" color="black" onClick={() => { }} />
                    <a href="#" className="text-center text-sm text-gray-500 font-medium hover:underline">
                        회원가입
                    </a>
                </div>
            </div>
        </div>
    );
}
