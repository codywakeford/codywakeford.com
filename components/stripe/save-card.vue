<template>
    <header>
        <h2>Add payment method</h2>
    </header>

    <div>
        <form>
            <div class="left">
                <div class="form-item">
                    <label for="cardNumber">Card Number</label>
                    <div class="input-element" id="card-number-element" ref="cardNumber" />
                </div>

                <div class="form-item">
                    <label for="cardExpiry">Expiration Date</label>
                    <div class="input-element" id="card-expiry-element" ref="cardExpiry" />
                </div>

                <div class="form-item">
                    <label for="cardCvc">CVC</label>
                    <div class="input-element" id="card-cvc-element" ref="cardCvc" />
                </div>

                <div class="form-item">
                    <label for="email">Reciept Email:</label>
                    <input class="input-element" type="email" placeholder="email" v-model="billingAddress.email" />
                </div>
            </div>

            <div class="right">
                <!-- <h3>Billing Address</h3> -->
                <div id="address-element" ref="addressElement"></div>
            </div>
        </form>
        <div class="button-box">
            <button-primary-m class="submit-button" @click="addCard">Save Card</button-primary-m>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import type {
    StripeCardCvcElement,
    StripeCardExpiryElement,
    StripeAddressElement,
    StripeCardNumberElement,
} from "@stripe/stripe-js"

import { loadStripe, type Stripe, type StripeCardElement } from "@stripe/stripe-js"

const card = ref<StripeCardNumberElement | null>(null)
const cardNumber = ref<StripeCardNumberElement | null>(null)
const cardExpiry = ref<StripeCardExpiryElement | null>(null)
const cardCvc = ref<StripeCardCvcElement | null>(null)
const addressElement = ref<StripeAddressElement | null>(null)
// const card = ref<StripeCardElement | null>(null)
const stripe = ref<Stripe | null>(null)

const billingAddress = ref<StripeBillingAddress>({
    name: "",
    line1: "",
    line2: "",
    email: "codypwakeford@gmail.com",
    country: "",
    city: "",
    state: "",
    postal_code: "",
})

const state = ref({
    successMessage: "",
    errorMessage: "",
    loading: false,
})

interface Props {
    type: "save-card" | "payment"
    options?: StripePaymentOptions
    metadata?: StripeMetaData

    /**Fired when payment is complete and returns a payment record for storage. */
    onComplete?: (setupRecord: PaymentMethod) => void
    onFailure?: () => void
}

const props = defineProps<Props>()

onMounted(async () => {
    const config = useRuntimeConfig()
    stripe.value = await loadStripe(config.public.STRIPE_PUBLISHABLE_KEY)

    if (!stripe.value || !cardNumber.value || !cardCvc.value || !cardExpiry.value) {
        throw new Error("Stripe not init")
    }

    const elements = stripe.value.elements()
    const cardNumberElement = elements.create("cardNumber")
    const cardExpiryElement = elements.create("cardExpiry")
    const cardCvcElement = elements.create("cardCvc")
    const addressElementInstance = elements.create("address", {
        mode: "billing",
    })

    cardNumberElement.mount("#card-number-element")
    cardExpiryElement.mount("#card-expiry-element")
    cardCvcElement.mount("#card-cvc-element")
    addressElementInstance.mount("#address-element")

    addressElementInstance.on("change", (event) => {
        billingAddress.value.name = event.value.name
        billingAddress.value.city = event.value.address.city
        billingAddress.value.line1 = event.value.address.line1
        billingAddress.value.line2 = event.value.address.line2
        billingAddress.value.country = event.value.address.country
        billingAddress.value.postal_code = event.value.address.postal_code
        billingAddress.value.state = event.value.address.state
    })

    card.value = cardNumberElement
})

async function addCard() {
    if (!stripe.value || !cardNumber.value || !card.value) {
        throw new Error("Stripe not initialized or card element not created!")
    }

    state.value.loading = true

    try {
        if (!billingAddress.value) return

        if (!$User.stripeCustomerId) {
            await $User.createStripeCustomer()
        }

        const customerId = $User.stripeCustomerId

        if (!customerId) throw new Error("Customer id not found")

        const paymentProfile = await $Stripe.setupPaymentMethod(
            stripe.value,
            card.value,
            billingAddress.value,
            customerId
        )

        if (paymentProfile) {
            await $User.createStripeCustomer(paymentProfile)

            if (props.onComplete) props.onComplete(paymentProfile)
            console.log("payment profile created")
        }
    } catch (error) {
        if (props.onFailure) {
            props.onFailure()
        }
    } finally {
        state.value.loading = false
    }
}

defineExpose({
    submit: addCard,
})
</script>

<style lang="scss" scoped>
h2 {
    font-size: 1.25rem;
    margin-bottom: 35px;
}
form {
    display: flex;
    gap: 25px;

    label {
        font-weight: 300;
        font-size: 0.9rem;
    }

    .left {
        display: flex;
        flex-direction: column;
        gap: 15px;
        min-width: 300px;

        .form-item {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
    }

    .right {
        display: flex;
        flex-direction: column;
        gap: 5px;

        h3 {
            font-weight: 500;
            margin-bottom: 10px;
        }
    }
}
.input-element {
    background: none;
    padding: 10px 10px;
    border: 1px solid lightgrey;
    border-radius: 5px;

    &:focus-within {
        border: 1px solid $primary;
        outline: none;
    }
}

.StripeElement--focus {
    border: 1px solid $primary;
}

.button-box {
    width: 100%;
    display: flex;
    justify-content: center;

    .submit-button {
        padding: 10px 20px;
        border-radius: 10px;
        margin-inline: auto;
        margin-top: 35px;
    }
}

.add-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 15px;
    cursor: pointer;

    outline: 1px solid $text-light3;
    border-radius: $border-radius;
    transition: none;

    span {
        font-size: 0.8rem;
        font-weight: 600;
    }

    &.selected {
        outline: 2px solid $primary;
    }
}

.saved-cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.payment-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}
</style>
