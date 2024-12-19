/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SnackBar } from '@/components/SnackBar';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, ArrowPathIcon } from '@heroicons/react/20/solid';
import LoadingScreen from '@/components/Loading/LoadingScreen';

export default function ChecksContent({ content, updateContent }) {
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [snackText, setSnackText] = useState('');
	const [groupedData, setGroupedData] = useState({});
	const [error, setError] = useState('');
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		console.log("yoooooooooooooo bro content ==", content);
		if (Array.isArray(content)) {
			// Group the checks by their names
			const grouped = content.reduce((acc, check) => {
				if (!acc[check.name]) {
					acc[check.name] = [];
				}
				acc[check.name].push(check);
				return acc;
			}, {});
			console.log('grouped ==', grouped),
				setGroupedData(grouped);
		}
	}, [content]);

	const handleRefreshClick = () => {
		setIsRefreshing(true);
		updateContent();

		// Add delay to simulate refreshing and stop the rotation animation after 1 second
		setTimeout(() => {
			setIsRefreshing(false);
		}, 1000);
	};

	return (
		<div className='w-full max-w-4xl mx-auto'>
			<div className='bg-primary flex justify-between items-center p-4 rounded-lg'>
				<h2 className='text-white font-bold text-lg'>Checks</h2>
				<button
					className={`top-4 right-4 text-white p-2 rounded-full bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 ${isRefreshing ? 'animate-spin' : ''}`}
					onClick={handleRefreshClick}
				>
					<ArrowPathIcon className="w-6 h-6" />
				</button>
			</div>
			<div className='bg-gray-50 p-6 rounded-lg max-h-[75vh] overflow-y-auto'>
				{(isRefreshing && (!groupedData || Object.keys(groupedData).length < 1)) && <LoadingScreen />}
				{!isRefreshing && groupedData && Object.keys(groupedData).length > 0 ? (
					Object.keys(groupedData).map((checkName) => (
						<Disclosure key={checkName}>
							{({ open }) => (
								<>
									<Disclosure.Button className='flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
										<span>{checkName}</span>
										<ChevronUpIcon
											className={`${open ? '' : 'transform rotate-180'} w-5 h-5 text-gray-500`}
										/>
									</Disclosure.Button>
									<Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-700'>
										<ul className='space-y-2'>
											{groupedData[checkName].map((check, checkIndex) => (
												<li key={`${checkName}-${checkIndex}`} className='border p-2 rounded bg-white shadow-sm'>
													<h3 className='font-semibold text-gray-800'>{check.description}</h3>
													<ul className='mt-2 space-y-1'>
														{check.issues.map((issue, issueIndex) => (
															<li key={issueIndex} className='text-sm'>
																<span className='font-bold'>Type:</span> {issue.type}<br />
																<span className='font-bold'>Chapter:</span> {issue.chapter}<br />
																<span className='font-bold'>Verse:</span> {issue.verse}<br />
																<span className='font-bold'>Message:</span> {issue.message}
															</li>
														))}
													</ul>
												</li>
											))}
										</ul>
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					))
				) : !isRefreshing && (
					<p className='text-center text-gray-500'>No content available.</p>
				)}
			</div>
			<SnackBar
				openSnackBar={openSnackBar}
				setOpenSnackBar={setOpenSnackBar}
				snackText={snackText}
				setSnackText={setSnackText}
				error={error}
			/>
		</div>
	);
}
