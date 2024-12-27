/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { SnackBar } from '@/components/SnackBar';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import LoadingScreen from '@/components/Loading/LoadingScreen';

export default function ChecksContent({ content, updateContent, onReferenceClick, recipe }) {
	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [snackText, setSnackText] = useState('');
	const [groupedData, setGroupedData] = useState({});
	const [error, setError] = useState('');
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [areAnyCheckSelected, setAreAnyCheckSelected] = useState(false);

	useEffect(() => {
		// console.log(recipe);
		recipe.map((el) => {
			if (el.enabled) setAreAnyCheckSelected(true);
		});
		if (Array.isArray(content)) {
			// Group the checks by their names
			const grouped = content.reduce((acc, check) => {
				if (!acc[check.readName]) {
					acc[check.readName] = [];
				}
				acc[check.readName].push(check);
				return acc;
			}, {});
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
			<div className='bg-primary flex justify-between items-center p-4 rounded-lg sticky top-0 z-10'>
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
									<Disclosure.Button className='flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75'>
										<span>{checkName}</span>
										<ChevronUpIcon
											className={`${open ? '' : 'transform rotate-180'} w-5 h-5 text-gray-500`}
										/>
									</Disclosure.Button>
									<Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-700'>
										<div className='space-y-4'>
											{groupedData[checkName].map((check, checkIndex) => (
												<div
													key={`${checkName}-${checkIndex}`}
													className='border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200'
												>
													<h3 className='font-semibold text-gray-800 mb-2'>
														<ExclamationCircleIcon className="h-5 w-5 text-red-500 inline-block mr-2" />
														{check.description}
													</h3>
													<div className='grid grid-cols-1 gap-3'>
														{check.issues.map((issue, issueIndex) => (
															<div
																key={issueIndex}
																className='bg-gray-50 border border-gray-300 p-3 rounded flex flex-col gap-2'
															>
																<div className="text-gray-800">
																	<span className='font-bold'>Type:</span> {issue.comment}{' '}{issue.difference ? `(${issue.difference})` : ''}
																</div>
																<div className="text-gray-800">
																	<span className='font-bold'>Reference:</span>{' '}
																	<button
																		onClick={() => onReferenceClick(issue.source_verse, issue.chapter, issue.verse, issue.comment)}
																		className="text-blue-500 hover:underline"
																	>
																		{issue.source_verse ?? (issue.chapter ? `${issue.chapter}:${issue.verse}` : `${issue.verse}`)}
																	</button>
																</div>
															</div>
														))}

													</div>
												</div>
											))}
										</div>
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					))
				) : !isRefreshing && (
					<p className='text-center text-gray-500'>{areAnyCheckSelected ? 'No results.' : 'Please check at least one check from the check dropdown.'}</p>
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
