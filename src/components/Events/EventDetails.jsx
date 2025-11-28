import { Link, Outlet, useParams } from 'react-router-dom';
import Header from '../Header.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../../util/http.js';

export default function EventDetails() {

  const { id } = useParams();

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['event-details', id],
    queryFn: ({ signal }) => { return fetchEvent({ id, signal }) },
  });

  console.log(data);


  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{data?.title}</h1>
          <nav>
            <button>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data?.image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data?.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data?.time}</time>
            </div>
            <p id="event-details-description">{data?.description}</p>
          </div>
        </div>
      </article>
    </>
  );
}
