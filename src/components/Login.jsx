import TailInput from "../UI/TailInput"
import TailButton from "../UI/TailButton"

export default function Login() {
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <p className="font-bold text-gray-700 text-2xl mb-10">로그인</p>
            <div className="w-[500px] flex flex-col gap-6">
                <TailInput label="아이디" type="userId" />
                <TailInput label="비밀번호" type="password" />
                <div className="flex justify-end gap-3">
                    <a href="#" className="block"><p className="text-sm/6 font-bold text-[#9D9D9D]">비밀번호 찾기</p></a>
                    <a href="#" className="block"><p className="text-sm/6 font-bold text-[#9D9D9D]">아이디 찾기</p></a>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                    <TailButton
                        caption="로그인" color="black" onClick={() => { }}
                    />
                    <a href="#" className="block"><p className="text-sm/6 font-bold text-[#9D9D9D]">회원가입</p></a>
                </div>
            </div>
        </div>
    )
}
