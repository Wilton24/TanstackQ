export async function fetchEvents({ signal, searchTerm }) {
    let url = 'http://localhost:3000/events';

    // console.log(`Search TERMSKIE: ${searchTerm}`);


    if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await fetch(url, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the events.');
        error.code = response.status;

        try {
            error.info = await response.json();
        } catch (e) {
            error.info = await response.text();
        }

        throw error;
    }

    const data = await response.json();

    if (!data || !data.events) {
        throw new Error('Invalid data format received from server. "events" property is missing.');
    }

    return data.events;
}