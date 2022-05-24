interface IOptions {
    onIgnored: () => void;
    onFallback: () => void;
    onReturn: () => void
}

export class DeepLinker {
    private hasFocus: boolean;
    private didHide: boolean;
    private options: IOptions;
    constructor(options: IOptions) {
        if (!options) {
            throw new Error('no options')
        }
        this.options = options;
        this.hasFocus = true;
        this.didHide = false
        this.#bindEvents('add');

    }

    #bindEvents(mode: 'add' | 'remove') {
        const globals = [window, document, window]
        const eventNames = ['blur', 'visibilitychange', 'focus'] as const;
        const handlers = [this.#onBlur, this.#onVisibilityChange, this.#onFocus]
        eventNames.forEach((eventName: typeof eventNames[number], index) => {
            const listenerMode: `${typeof mode}EventListener` = `${mode}EventListener`;
            const globalVar = globals?.[index];
            const handler = handlers?.[index];
            globalVar?.[listenerMode]?.(eventName, handler);
        })
    }

    // window is blurred when dialogs are shown
    #onBlur() {
        this.hasFocus = false;
    };

    // document is hidden when native app is shown or browser is backgrounded
    #onVisibilityChange(e: Event) {
        // @ts-ignore
        if (e?.target?.visibilityState === 'hidden') {
            this.didHide = true;
        }
    };

    // window is focused when dialogs are hidden, or browser comes into view
    #onFocus() {
        if (this.didHide) {
            if (this.options.onReturn) {
                this.options.onReturn();
            }

            this.didHide = false; // reset
        } else {
            // ignore duplicate focus event when returning from native app on
            // iOS Safari 13.3+
            if (!this.hasFocus && this.options.onFallback) {
                // wait for app switch transition to fully complete - only then is
                // 'visibilitychange' fired
                setTimeout(() => {
                    // if browser was not hidden, the deep link failed
                    if (!this.didHide) {
                        this.options.onFallback();
                    }
                }, 1000);
            }
        }

        this.hasFocus = true;
    };

    destroy() {
        this.#bindEvents('remove');
    }
    openURL(url: string) {
        const dialogTimeout = 1500;

        setTimeout(() => {
            if (this.hasFocus && this.options.onIgnored) {
                this.options.onIgnored();
            }
        }, dialogTimeout);

        window.location.href = url;
    }
}
