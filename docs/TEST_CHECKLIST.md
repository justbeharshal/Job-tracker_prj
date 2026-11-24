# Test Checklist

- [ ] Register with duplicate email returns 409
- [ ] Login with wrong password returns 401
- [ ] Protected route without token returns 401
- [ ] User B cannot read, edit or delete user A's application
- [ ] Create application with missing role returns 400
- [ ] Changing stage writes a status_history row
- [ ] Search, stage filter and pagination work together
- [ ] Deleting an application removes its notes and history
- [ ] Dashboard counts match the database
- [ ] Refresh keeps user logged in; logout clears token
- [ ] Live site works after deploy (CORS and env variables correct)
