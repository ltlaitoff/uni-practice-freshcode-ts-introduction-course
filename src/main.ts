/**
 * Assert used to check if some statement is always truth, aka invariant
 * Will, and should, crash program if not
 */
function assert(truth: boolean, message: string): asserts truth {
    if (!truth) {
        throw new Error("[ASSERT]: " + message)
    }
}

// This enum can, and should, be replaced by an array, but by the task we need an enum
// WARNING: Enums has a lot of subtle behaviors and violate some of TS core principles
// Reference: https://www.totaltypescript.com/why-i-dont-like-typescript-enums
enum Colors {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE",
}

// NOTE: Hobby and HobbyYears can, and actually should be moved to another structure, because it's more additional
// information about User that we don't need every time
interface User {
    name: string
    age: number
    hobby: string
    hobbyYears: number
}

// NOTE: We're using "!" because when we're using this variable in the function TypeScript still thinks that
// is having a type "Element | null", even if we have a assert of just if check with error
const app = document.querySelector("#app")!
assert(app != null, "App element should always exist!")

// Fill up color select in form with values. Should be called before user can interact with form
function initColors(colors: HTMLSelectElement) {
    // TypeScript has a lot of problem when we try to do stuff like this because Enum's are actually an objects
    // And, as all objects, they can have many parameters
    // And it means that we cannot safely map on Enum values without additional checks
    // It will be a lot safer to create array of Colors instead of Enum, which is needed by the task for some reason
    for (const colorKey of Object.keys(Colors)) {
        assert(isNaN(Number(colorKey)), "Color key from enum is not NaN")
        const color = Colors[colorKey as keyof typeof Colors]
        assert(Boolean(color), "Color from enum by key should exists")

        const option = document.createElement("option")
        option.value = color
        option.textContent = color
        colors.append(option)
    }
}

function main() {
    const form = app.querySelector("#form")
    assert(form != null, "Form should always exist!")
    assert(form instanceof HTMLFormElement, "Form should be a Form!")

    const formColors = app.querySelector("#form-colors")
    assert(formColors != null, "Form colors should always exist!")
    assert(formColors instanceof HTMLSelectElement, "Form colors should be a Select!")

    initColors(formColors)

    form.addEventListener("submit", formSubmitHandler)
}

/**
 * Show the information about User on the screen
 */
function renderUser(user: User) {
    const output = app.querySelector("#user-output")
    assert(output != null, "User output should always exist!")

    function renderAge(age: number) {
        const lastDigit = age % 10

        if (lastDigit === 1) return `${age} рік`

        if (lastDigit >= 2 && lastDigit <= 4) {
            const lastTwoDigit = age % 100

            if (lastTwoDigit < 11 || lastDigit > 14) {
                return `${age} роки`
            }
        }

        return `${age} років`
    }

    function renderHobbyYears(hobby: string, years: number) {
        if (years > 5) return `Вау, ти справжній експерт у ${hobby}!`
        if (years >= 1) return `Чудово, ти вже маєш досвід у ${hobby}`
        return "Все попереду! Починати нове хобі — це цікаво."
    }

    const messageTemplate = `Привіт, ${user.name}! Тобі ${renderAge(user.age)}. Твоє хобі — ${user.hobby}. Вау, ти справжній експерт у ${renderHobbyYears(user.hobby, user.hobbyYears)}!`

    output.textContent = messageTemplate
}

/**
 * Change, by task, color of #app
 */
function renderColor(color: string) {
    assert(app instanceof HTMLElement, "App is an html element")
    app.style.backgroundColor = color
}

function formSubmitHandler(e: Event) {
    e.preventDefault()
    const form = e.target
    assert(form != null && form instanceof HTMLFormElement, "Form should be a Form!")

    // NOTE: We need all of that validations to be sure that we have a right values
    // It can be refactored later

    assert("name" in form.elements, "Form should have field 'name'")
    const nameInput = form.elements["name"]
    assert(Boolean(nameInput) && nameInput instanceof HTMLInputElement && nameInput.type == "text", "Name input should be an input")

    assert("age" in form.elements, "Form should have field 'age'")
    const ageInput = form.elements["age"]
    assert(Boolean(ageInput) && ageInput instanceof HTMLInputElement && ageInput.type == "number", "Age input should be an input")
    assert(ageInput.value != "" && !Number.isNaN(Number(ageInput.value)), "Age input value should not be NaN")

    assert("hobby" in form.elements, "Formhobby should have field 'hobby'")
    const hobbyInput = form.elements["hobby"]
    assert(Boolean(hobbyInput) && hobbyInput instanceof HTMLInputElement && hobbyInput.type == "text", "Hobby input should be an input")

    assert("hobby-years" in form.elements, "Form should have field 'hobby-years'")
    const hobbyYearsInput = form.elements["hobby-years"]
    assert(Boolean(hobbyYearsInput) && hobbyYearsInput instanceof HTMLInputElement && hobbyYearsInput.type == "number", "Hobby years input should be an input")
    assert(hobbyYearsInput.value != "" && !Number.isNaN(Number(hobbyYearsInput.value)), "Hobby years input value should not be NaN")

    assert("colors" in form.elements, "Form should have field 'colors'")
    const colors = form.elements["colors"]
    assert(Boolean(colors) && colors instanceof HTMLSelectElement, "Hobby years input should be an select")

    const user: User = {
        name: nameInput.value,
        age: Number(ageInput.value),
        hobby: hobbyInput.value,
        hobbyYears: Number(hobbyYearsInput.value),
    }

    renderUser(user)
    renderColor(colors.value)
}

main()
