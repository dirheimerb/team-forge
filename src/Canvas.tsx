/* eslint-disable no-inner-declarations */
import '@tldraw/tldraw/tldraw.css';
import { TLEventInfo, Tldraw, TLEventMapHandler, 
    InstancePresenceRecordType, Editor, createTLStore, defaultShapeUtils, throttle } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback, useEffect, useRef, useLayoutEffect, useState } from 'react'
import _ from 'lodash';

const PERSISTENCE_KEY = 'tldraw-persistence'
const USER_NAME = 'huppy da arrow'
const MOVING_CURSOR_SPEED = 0.25 // 0 is stopped, 1 is full send
const MOVING_CURSOR_RADIUS = 100
const CURSOR_CHAT_MESSAGE = 'Hey, I think this is just great.'
export default function Canvas() {
    const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }))
	const [events, setEvents] = useState<any[]>([])
    const [editor, setEditor] = useState<Editor>()
    const [storeEvents, setStoreEvents] = useState<string[]>([])
    const rRaf = useRef<any>(-1)

	const handleEvent = useCallback((data: TLEventInfo) => {
		setEvents((events) => {
			const newEvents = events.slice(0, 100)
			if (
				newEvents[newEvents.length - 1] &&
				newEvents[newEvents.length - 1].type === 'pointer' &&
				data.type === 'pointer' &&
				data.target === 'canvas'
			) {
				newEvents[newEvents.length - 1] = data
			} else {
				newEvents.unshift(data)
			}
			return newEvents
		})
	}, [])
    const setAppToState = useCallback((editor: Editor) => {
		setEditor(editor)
        // const peerPresence = InstancePresenceRecordType.create({
        //     id: InstancePresenceRecordType.createId(editor.store.id),
        //     currentPageId: editor.getCurrentPageId(),
        //     userId: 'peer-1',
        //     userName: USER_NAME,
        //     cursor: { x: 0, y: 0, type: 'default', rotation: 0 },
        //     chatMessage: CURSOR_CHAT_MESSAGE,
        // })

        // editor.store.put([peerPresence])

        const raf = rRaf.current
					// cancelAnimationFrame(raf)

					// if (MOVING_CURSOR_SPEED > 0 || CURSOR_CHAT_MESSAGE) {
					// 	function loop() {
					// 		let cursor = peerPresence.cursor
					// 		let chatMessage = peerPresence.chatMessage

					// 		const now = Date.now()

					// 		if (MOVING_CURSOR_SPEED > 0) {
					// 			const k = 1000 / MOVING_CURSOR_SPEED
					// 			const t = (now % k) / k

					// 			cursor = {
					// 				...peerPresence.cursor,
					// 				x: 150 + Math.cos(t * Math.PI * 2) * MOVING_CURSOR_RADIUS,
					// 				y: 150 + Math.sin(t * Math.PI * 2) * MOVING_CURSOR_RADIUS,
					// 			}
					// 		}

					// 		if (CURSOR_CHAT_MESSAGE) {
					// 			const k = 1000
					// 			const t = (now % (k * 3)) / k
					// 			chatMessage =
					// 				t < 1
					// 					? ''
					// 					: t > 2
					// 						? CURSOR_CHAT_MESSAGE
					// 						: CURSOR_CHAT_MESSAGE.slice(
					// 								0,
					// 								Math.ceil((t - 1) * CURSOR_CHAT_MESSAGE.length)
					// 							)
					// 		}

					// 		editor.store.put([
					// 			{
					// 				...peerPresence,
					// 				cursor,
					// 				chatMessage,
					// 				lastActivityTimestamp: now,
					// 			},
					// 		])

					// 		rRaf.current = requestAnimationFrame(loop)
					// 	}

					// 	rRaf.current = requestAnimationFrame(loop)
					// } else {
					// 	editor.store.put([{ ...peerPresence, lastActivityTimestamp: Date.now() }])
					// 	rRaf.current = setInterval(() => {
					// 		editor.store.put([{ ...peerPresence, lastActivityTimestamp: Date.now() }])
					// 	}, 1000)
					// }
	}, [])

	

	useEffect(() => {
		if (!editor) return

		function logChangeEvent(eventName: string) {
			setStoreEvents((events) => [...events, eventName])
		}

		//[1]
		const handleChangeEvent: TLEventMapHandler<'change'> = (change) => {
			// Added
			for (const record of Object.values(change.changes.added)) {
				if (record.typeName === 'shape') {
					logChangeEvent(`created shape (${record.type})\n`)
				}
			}

			// Updated
			for (const [from, to] of Object.values(change.changes.updated)) {
				if (
					from.typeName === 'instance' &&
					to.typeName === 'instance' &&
					from.currentPageId !== to.currentPageId
				) {
					logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`)
				} else if (from.id.startsWith('shape') && to.id.startsWith('shape')) {
					let diff = _.reduce(
						from,
						(result: any[], value, key: string) =>
							_.isEqual(value, (to as any)[key]) ? result : result.concat([key, value]),
						[]
					)
					if (diff?.[0] === 'props') {
						diff = _.reduce(
							(from as any).props,
							(result: any[], value, key) =>
								_.isEqual(value, (to as any).props[key]) ? result : result.concat([key, value]),
							[]
						)
					}
					logChangeEvent(`updated shape (${JSON.stringify(diff)})\n`)
				}
			}

			// Removed
			for (const record of Object.values(change.changes.removed)) {
				if (record.typeName === 'shape') {
					logChangeEvent(`deleted shape (${record.type})\n`)
				}
			}
		}

		// [2]
		const cleanupFunction = editor.store.listen(handleChangeEvent, { source: 'user', scope: 'all' })

		return () => {
			cleanupFunction()
		}
	}, [editor])

    const [loadingState, setLoadingState] = useState<
		{ status: 'loading' } | { status: 'ready' } | { status: 'error'; error: string }
	>({
		status: 'loading',
	})
	//[3]
	useLayoutEffect(() => {
		setLoadingState({ status: 'loading' })

		// Get persisted data from local storage
		const persistedSnapshot = localStorage.getItem(PERSISTENCE_KEY)

		if (persistedSnapshot) {
			try {
				const snapshot = JSON.parse(persistedSnapshot)
				store.loadSnapshot(snapshot)
				setLoadingState({ status: 'ready' })
			} catch (error: any) {
				setLoadingState({ status: 'error', error: error.message }) // Something went wrong
			}
		} else {
			setLoadingState({ status: 'ready' }) // Nothing persisted, continue with the empty store
		}

		// Each time the store changes, run the (debounced) persist function
		const cleanupFn = store.listen(
			throttle(() => {
				const snapshot = store.getSnapshot()
				localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot))
			}, 500)
		)

		return () => {
			cleanupFn()
		}
	}, [store])

	// [4]
	if (loadingState.status === 'loading') {
		return (
			<div className="tldraw__editor">
				<h2>Loading...</h2>
			</div>
		)
	}

	if (loadingState.status === 'error') {
		return (
			<div className="tldraw__editor">
				<h2>Error!</h2>
				<p>{loadingState.error}</p>
			</div>
		)
	}


	return (
		<div style={{ display: 'flex' }}>
			<div style={{ width: '90%', height: '100vh' }}>
				<Tldraw
					onMount={setAppToState}
                    autoFocus
                    store={store}
                    
				/>
			</div>
			{/* <div
				style={{
					width: '50%',
					height: '100vh',
					padding: 8,
					background: '#eee',
					border: 'none',
					fontFamily: 'monospace',
					fontSize: 12,
					borderLeft: 'solid 2px #333',
					display: 'flex',
					flexDirection: 'column-reverse',
					overflow: 'auto',
					whiteSpace: 'pre-wrap',
				}}
				onCopy={(event) => event.stopPropagation()}
			>
				<div>{JSON.stringify(storeEvents, undefined, 2)}</div>
			</div> */}
		</div>
	)
}