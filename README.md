# Replica: Scientific Results Validation for Research Replication

Replica is a full-stack application designed to help users validate research results by replicating scientific analysis findings. This project uses ReactJS for the frontend and Python/Django for the backend.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Python 3.8+
- Node.js 14+
- npm 6+ or yarn 1.22+
- Poetry (Python package manager)

## Installation

### Backend Setup

1. Clone the repository:

```
git clone https://github.com/your-username/replica.git
cd replica
```
2. Set up the Python environment using Poetry and activate the shell:

```
poetry install
poetry shell
```

3. Apply database migrations:

```
python manage.py migrate
```

4. Navigate to front-end directory:

```
cd replica-client
```

5. Install dependencies:

```
npm install
```

6. Navigate to root directory:

```
cd ..
```
7. Make the startup script executable and run startup:

```
chmod +x run_dev.sh
./run_dev.sh
```

8. Access the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

## Project Structure

- `api/`: Django project and settings
- `replica-client/`: React application built with Vite

## Features

- User authentication
- Project creation and management
- Data file upload and metadata input
- (Future) Analysis capabilities for protein structure/property prediction and gene expression analysis

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Poetry](https://python-poetry.org/)


