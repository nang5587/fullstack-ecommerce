import MyPageMenu from "./MyPageMenu"

export default function MyPageLayout({selectedTab, onChangeTab, children}) {
    return (
        <div className="w-10/12 mx-auto flex border-t border-gray-200 mt-10 pt-8 min-h-screen">
            <MyPageMenu selectedTab={selectedTab} onChangeTab={onChangeTab} />
            <div className="flex-1 pl-8">
                {children}
            </div>
        </div>
    )
}
