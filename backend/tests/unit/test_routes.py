# -*- coding: utf-8 -*-

# database URL must be set in .env file for tests to work
# the result of some test (body) will depend on the current state of the database

def test_authentication(client):
    """Test of authentication endpoint"""
    data = {
        'username': 'admin',
        'password': '1234'
    }
    response = client.post('/authentication/validate', json=data)
    assert response.status_code == 200
    assert b'admin' in response.data


def test_done_ids(client):
    """Test of images/table endpoint"""
    data = {
        'label': 'done',
        'id_mode': True
    }
    done = b'[6,7,5,4]' # adjust depending on the ids of labelled images in the database
    response = client.post('/images/table', json=data)
    assert response.status_code == 200
    assert done in response.data

def test_pending_ids(client):
    """Test of images/table endpoint"""
    data = {
        'label': 'pending',
        'id_mode': True
    }
    pending = b'[3,2,1]' # adjust depending on the ids of non-labelled images in the database
    response = client.post('/images/table', json=data)
    assert response.status_code == 200
    assert pending in response.data

def test_get_labels(client):
    """Test of labels/get endpoint"""
    labels = b'["With mask","Without mask"]'
    response = client.get('/labels/get')
    assert response.status_code == 200
    assert labels in response.data

def test_update_mask(client):
    """Test of labels/get endpoint"""
    data = {
        'id': 7,
        'mask': 'With mask',
        'labeller': 'labeller1'
    }
    pending = b'Success'
    response = client.put('/images/update_mask', json=data)
    assert response.status_code == 200
    assert pending in response.data

