import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux'
import App from "./App.tsx";
import store from './redux/store'
import "./index.css";
import api from '@/lib/api'
import { setUser } from '@/redux/userSlice'

// Try to fetch current user from server (accessToken cookie) and populate Redux before rendering
;(async () => {
	try {
		const res = await api.get('/users/me')
		if (res?.data) store.dispatch(setUser(res.data))
	} catch (err) {
		// ignore — user will be unauthenticated
		// console.info('No current user', err)
	}

	createRoot(document.getElementById("root")!).render(
		<Provider store={store}>
			<App />
		</Provider>
	);
})()
