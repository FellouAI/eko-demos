if (!window.eko) {
    window.eko = { lastMouseX: 0, lastMouseY: 0 };
}
eko.sub = function (event, callback) {
    if (!eko.subListeners) {
        eko.subListeners = {};
    }
    if (event && callback) {
        eko.subListeners[event] = callback;
    }
};
document.addEventListener('mousemove', (event) => {
    eko.lastMouseX = event.clientX;
    eko.lastMouseY = event.clientY;
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    (async () => {
        try {
            switch (request.type) {
                case 'eko:message': {
                    let result = null;
                    if (eko.subListeners && eko.subListeners[request.event]) {
                        try {
                            result = await eko.subListeners[request.event](request.params);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                    sendResponse(result);
                    break;
                }
                case 'page:getDetailLinks': {
                    let result = await eko.getDetailLinks(request.search);
                    sendResponse(result);
                    break;
                }
                case 'page:getContent': {
                    let result = await eko.getContent(request.search);
                    sendResponse(result);
                    break;
                }
                case 'computer:type': {
                    sendResponse(type(request));
                    break;
                }
                case 'computer:mouse_move': {
                    sendResponse(mouse_move(request));
                    break;
                }
                case 'computer:left_click': {
                    sendResponse(simulateMouseEvent(request, ['mousedown', 'mouseup', 'click'], 0));
                    break;
                }
                case 'computer:right_click': {
                    sendResponse(simulateMouseEvent(request, ['mousedown', 'mouseup', 'contextmenu'], 2));
                    break;
                }
                case 'computer:double_click': {
                    sendResponse(simulateMouseEvent(request, ['mousedown', 'mouseup', 'click', 'mousedown', 'mouseup', 'click', 'dblclick'], 0));
                    break;
                }
                case 'computer:scroll_to': {
                    sendResponse(scroll_to(request));
                    break;
                }
                case 'computer:cursor_position': {
                    sendResponse({ coordinate: [eko.lastMouseX, eko.lastMouseY] });
                    break;
                }
                case 'computer:get_dropdown_options': {
                    sendResponse(get_dropdown_options(request));
                    break;
                }
                case 'computer:select_dropdown_option': {
                    sendResponse(select_dropdown_option(request));
                    break;
                }
            }
        }
        catch (e) {
            console.log('onMessage error', e);
            sendResponse(false);
        }
    })();
    return true;
});
function type(request) {
    let text = request.text;
    let enter = false;
    if (text.endsWith('\\n')) {
        enter = true;
        text = text.substring(0, text.length - 2);
    }
    else if (text.endsWith('\n')) {
        enter = true;
        text = text.substring(0, text.length - 1);
    }
    let element;
    if (request.highlightIndex != null) {
        element = window.get_highlight_element(request.highlightIndex);
    }
    else if (request.xpath) {
        let xpath = request.xpath;
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        element = result.singleNodeValue;
    }
    else {
        let coordinate = request.coordinate;
        element = document.elementFromPoint(coordinate[0], coordinate[1]) || document.activeElement;
    }
    if (!element) {
        return false;
    }
    let input;
    if (element.tagName == 'INPUT' ||
        element.tagName == 'TEXTAREA' ||
        element.childElementCount == 0) {
        input = element;
    }
    else {
        input = element.querySelector('input') || element.querySelector('textarea') || element;
    }
    input.focus && input.focus();
    if (!text) {
        input.value = '';
    }
    else {
        input.value += text;
    }
    let result = input.dispatchEvent(new Event('input', { bubbles: true }));
    if (enter) {
        ['keydown', 'keypress', 'keyup'].forEach((eventType) => {
            const event = new KeyboardEvent(eventType, {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                bubbles: true,
                cancelable: true,
            });
            input.dispatchEvent(event);
        });
    }
    console.log('type', input, request, result);
    return true;
}
function mouse_move(request) {
    let coordinate = request.coordinate;
    let x = coordinate[0];
    let y = coordinate[1];
    const event = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: x,
        screenY: y,
        clientX: x,
        clientY: y,
    });
    let result = document.body.dispatchEvent(event);
    console.log('mouse_move', document.body, request, result);
    return true;
}
function simulateMouseEvent(request, eventTypes, button) {
    let element;
    if (request.highlightIndex != null) {
        element = window.get_highlight_element(request.highlightIndex);
    }
    else if (request.xpath) {
        let xpath = request.xpath;
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        element = result.singleNodeValue;
    }
    else {
        let coordinate = request.coordinate;
        element = document.elementFromPoint(coordinate[0], coordinate[1]) || document.body;
    }
    if (!element) {
        return false;
    }
    const x = undefined;
    const y = undefined;
    for (let i = 0; i < eventTypes.length; i++) {
        const event = new MouseEvent(eventTypes[i], {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button, // 0 left; 2 right
        });
        let result = element.dispatchEvent(event);
        console.log('simulateMouse', element, { ...request, eventTypes, button }, result);
    }
    return true;
}
function scroll_to(request) {
    if (request.highlightIndex != null) {
        let element = window.get_highlight_element(request.highlightIndex);
        if (!element) {
            return false;
        }
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
    else if (request.xpath) {
        let xpath = request.xpath;
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        let element = result.singleNodeValue;
        if (!element) {
            return false;
        }
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
    else {
        const to_coordinate = request.to_coordinate;
        window.scrollTo({
            left: to_coordinate[0],
            top: to_coordinate[1],
            behavior: 'smooth',
        });
    }
    console.log('scroll_to', request);
    return true;
}
function get_dropdown_options(request) {
    let select;
    if (request.highlightIndex != null) {
        select = window.get_highlight_element(request.highlightIndex);
    }
    else if (request.xpath) {
        select = document.evaluate(request.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    if (!select) {
        return null;
    }
    return {
        options: Array.from(select.options).map((opt) => ({
            index: opt.index,
            text: opt.text.trim(),
            value: opt.value,
        })),
        id: select.id,
        name: select.name,
    };
}
function select_dropdown_option(request) {
    let select;
    if (request.highlightIndex != null) {
        select = window.get_highlight_element(request.highlightIndex);
    }
    else if (request.xpath) {
        select = document.evaluate(request.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    if (!select || select.tagName.toUpperCase() !== 'SELECT') {
        return { success: false, error: 'Select not found or invalid element type' };
    }
    const option = Array.from(select.options).find((opt) => opt.text.trim() === request.text);
    if (!option) {
        return {
            success: false,
            error: 'Option not found',
            availableOptions: Array.from(select.options).map((o) => o.text.trim()),
        };
    }
    select.value = option.value;
    select.dispatchEvent(new Event('change'));
    return {
        success: true,
        selectedValue: option.value,
        selectedText: option.text.trim(),
    };
}
