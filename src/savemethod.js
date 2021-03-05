import React, { useState, useEffect } from 'react';

// graphql
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

// stripe
import { loadStripe } from '@stripe/stripe-js';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
	'pk_test_51Hmu6JLGmRJWtU7Yhf5IOSWeyP6rme5MS2yHqfNC7hx6WziuZcTYg0YnPwDXOM415qy5BLc1zJnW9ZYmhVJMjsSc0063SQQ7CI'
);

const SAVE_CARD = gql`
	mutation($redirectUrl: String!) {
		saveCard(redirectUrl: $redirectUrl) {
			success
			message
			debugMessage
		}
	}
`;

export default function App() {
	const [error, setError] = useState('');
	const [sessionId, setSessionId] = useState('');

	const [saveCard] = useMutation(SAVE_CARD, {
		variables: { redirectUrl: '/' },
		onCompleted: ({ saveCard }) => {
			console.log('saveCard', saveCard);
			const { debugMessage } = saveCard;
			setSessionId(debugMessage);
		},
		onError: ({ message }) => setError(message.split('GraphQL error: ')[1])
	});

	useEffect(() => {
		saveCard();
	}, []);
	const handleClick = async (event) => {
		// Call your backend to create the Checkout session.
		// When the customer clicks on the button, redirect them to Checkout.

		const stripe = await stripePromise;
		const response = await stripe.redirectToCheckout({ sessionId });

		// If `redirectToCheckout` fails due to a browser or network
		// error, display the localized error message to your customer
		// using `error.message`
		if (response.error) setError(response.error.message);
	};
	if (error) {
		return (
			<div>
				<h3>{error}</h3>
				<button onClick={() => setError('')}>test again</button>
			</div>
		);
	}
	return (
		<button role='link' onClick={handleClick}>
			Checkout
		</button>
	);
}
