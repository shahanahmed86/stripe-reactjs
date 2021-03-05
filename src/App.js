import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from './checkout';
import SaveMethod from './savemethod';

import './App.css';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
	'pk_test_51Hmu6JLGmRJWtU7Yhf5IOSWeyP6rme5MS2yHqfNC7hx6WziuZcTYg0YnPwDXOM415qy5BLc1zJnW9ZYmhVJMjsSc0063SQQ7CI'
);

function App() {
	return (
		<Elements stripe={stripePromise}>
			<SaveMethod />
		</Elements>
	);
}

export default App;
