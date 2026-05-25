<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";

    let { sendAlert } = $props();

    // Modal properties
    let width = $state(400);
    let height = $state(265);
    let left = $state(200);
    let top = $state(200);
    let isVisible = $state(false);
    
    // Handles tracking whether we're registering or logging in
    let formName = $state("login");
    const actionURI = $derived(`?/${formName}`);
    let userIsRegistering = $state(false);
    let loginButtonClass = $state("btn btn-xs btn-active");
    let registerButtonClass = $state("btn btn-xs");

    // Input fields & validation
    let passwordField: string = $state('');
    let usernameField: string = $state('');
    let emailField: string = $state('');
    let registrationIsValid = $derived(passwordField !== '' && usernameField !== '' && emailField !== '');
    let loginIsValid = $derived(emailField !== '' && passwordField !== '');

    // Drag movement
    let moving = false;

    export function show() {
        isVisible = true;
    }

    export function hide() {
        isVisible = false;
    }

    function onMouseDown() {
        moving = true;
    }

    function onMouseUp() {
        moving = false;
    }

    function onMouseMove(e: MouseEvent) {
        if (moving) {
            left += e.movementX;
            top += e.movementY;
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            hide()
        }
    }

    function onDoLogin() {
        userIsRegistering = false;
        loginButtonClass = "btn btn-xs btn-active"
        registerButtonClass = "btn btn-xs"
    }

    function onDoRegister() {
        userIsRegistering = true;
        loginButtonClass = "btn btn-xs"
        registerButtonClass = "btn btn-xs btn-active"
    }

    const handleSubmit: SubmitFunction = () => {
        return async ({ result, update }) => {
            if (result.type === 'error') {
                sendAlert(result.type, result?.error ?? 'Unknown error');
            } else if (result.type === 'failure') {
                sendAlert(result.type, result.data?.error ?? 'Unknown error');
            } else if (result.type === 'success') {
                sendAlert(result.type, 'Success!');
            }
            update()
        }
    }

    $effect(() => {
        if (userIsRegistering) {
            formName = "register"
        } else {
            formName = "login"
        }
    });
</script>

<!-- TODO: Add 'X' to modal -->
<!-- TODO: fix a11y thing below -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="p-2 gap-3 z-999999 bg-white rounded-lg cursor-move"
    style:user-select=none
    style:position=absolute
    style:left={left}px
    style:top={top}px
    style:width={width}px
    style:height={height}px
    style:visibility={isVisible ? 'visible' : 'hidden'}
    onmousedown={onMouseDown}
    role="form"
    bind:clientWidth={width}
>
    <div class='h-full'>
        <div class="h-6 m-2">
            <button class="btn btn-sm btn-ghost right-0.5 top-2 absolute font-bold" onclick={hide}>X</button>
        </div>
        <form
            method="POST"
            name={formName}
            action={actionURI}
            use:enhance={handleSubmit}
        >
            <!-- E-mail input -->
            <div class="m-2">
                <label class="input validator w-full">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-width="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input type="email" placeholder="mail@site.com" required name="e-mail" bind:value={emailField} />
                </label>
            </div>
            <!-- Username input -->
            {#if userIsRegistering}
                <div class="m-2">
                    <label class="input validator w-full">
                        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke-width="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                            </g>
                        </svg>
                        <input
                            type="text"
                            required
                            placeholder="Username"
                            pattern="[A-Za-z][A-Za-z0-9\-]*"
                            minlength="3"
                            maxlength="30"
                            title="Only letters, numbers or dash"
                            class="w-full"
                            name="username"
                            bind:value={usernameField}
                        />
                    </label>
                </div>
            {/if}
            <!-- Password input -->
            <div class="m-2">
                <label class="input validator w-full">
                    <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            stroke-linejoin="round"
                            stroke-linecap="round"
                            stroke-width="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                        <path
                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                        ></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        </g>
                    </svg>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        minlength="8"
                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        bind:value={passwordField}
                    />
                </label>
            </div>
            <!-- Submit button -->
            <div class="flex justify-center">
                <button
                    class="btn w-90"
                    type="submit"
                    disabled={userIsRegistering ? !registrationIsValid : !loginIsValid}
                    formaction={actionURI}
                    onclick={() => hide()}
                >
                    {#if userIsRegistering}
                        Register
                    {:else}
                        Login
                    {/if}
                </button>
            </div>
        </form>
        <!-- Swap between registration and login -->
        <div class="join flex w-full m-4">
            <!-- TODO: a11y -->
            <!-- svelte-ignore a11y_interactive_supports_focus -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <buton
                class={loginButtonClass}
                onclick={onDoLogin}
                role="button"
            >
                Login
            </buton>
            <!-- TODO: a11y -->
            <!-- svelte-ignore a11y_interactive_supports_focus -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <buton
                class={registerButtonClass}
                onclick={onDoRegister}
                role="button"
            >
                Register
            </buton>
        </div>
    </div>
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:keydown={handleKeydown} />