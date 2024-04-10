export const setFocus = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    element.focus();
};

export const removeFocus = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    element.blur();
};

export const emptyValue = (selector: string) => {
    const element = document.querySelector(selector) as HTMLInputElement;
    element.value = '';
};

export const getValue = (selector: string) => {
    const element = document.querySelector(selector) as HTMLInputElement;
    return element.value;
};
