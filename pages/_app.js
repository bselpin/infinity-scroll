import { useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import "../styles/globals.scss"

// React Query의 QueryClient 설정. 나중에 추가해줄 예정이다
const queryOption = {
	defaultOptions: {
		queries: {},
	},
}

const App = ({ Component, pageProps }) => {
	const [queryClient] = useState(() => new QueryClient(queryOption))

	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default App
