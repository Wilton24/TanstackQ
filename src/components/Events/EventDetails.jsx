import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, deleteEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import ConfirmationModal from '../UI/ConfirmationModal.jsx';

export default function EventDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    mutate,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
    reset: resetDeleteMutation
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'], refetchType: 'none' });
      navigate('/events');
    }
  });

  const { data, isPending: isFetching, isError: isFetchError, error: fetchError } = useQuery({
    queryKey: ['event-details', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    enabled: !!id,
  });


  function startDeleteHandler() {
    setIsModalOpen(true);
  }

  function cancelDeleteHandler() {
    setIsModalOpen(false);
    resetDeleteMutation();
  }

  function confirmDeleteHandler() {
    mutate({ id });
    setIsModalOpen(false);
  }

  let content;

  if (isFetching) {
    content = (
      <div id="event-details-content" className='center'>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (isFetchError) {
    content = (
      <div id="event-details-content" className='center'>
        <ErrorBlock
          title="Error loading event details"
          message={fetchError.info?.message || "An unexpected error occurred while fetching the event."}
        />
      </div>
    );
  };

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    content = (
      <div id="event-details-content">
        <img
          src={`http://localhost:3000/${data.image}`}
          alt={data.title}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/D1D5DB/1F2937?text=Event+Image'; }}
        />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{data.location}</p>
            <time dateTime={`${data.date}T${data.time}`}>{formattedDate} @ {data.time}</time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isModalOpen && (
        <ConfirmationModal
          open={isModalOpen}
          onClose={cancelDeleteHandler}
          onConfirm={confirmDeleteHandler}
          title="Confirm Deletion"
          message="Are you sure you want to permanently delete this event? This action cannot be undone."
        />
      )}

      {isDeleteError && (
        <ConfirmationModal
          open={isDeleteError}
          onClose={resetDeleteMutation}
          onConfirm={resetDeleteMutation}
          title="Deletion Failed"
          message={deleteError.info?.message || "Could not delete the event. Please check your connection."}
        />
      )}

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
            <button
              onClick={startDeleteHandler}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        {content}
      </article>
    </>
  );
}