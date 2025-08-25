from django.shortcuts import render , redirect 
from django.http import JsonResponse
from django.contrib import messages
from .models import User
from django.contrib.auth.hashers import check_password
from .models import User, University, Department, Branch
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def register(request):
    if request.method == "POST":
        data = request.POST
        errors = {}

        username = data.get("username", "").strip()
        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()
        personal_email = data.get("personal_email", "").strip()
        password = data.get("current_password", "").strip()
        gender = data.get("gender", "").strip()
        year = data.get("year", "").strip()
        university_id = data.get("university_name")
        department_id = data.get("department")
        branch_id = data.get("branch")

        # --- VALIDATIONS ---
        if not username:
            errors["username"] = "Username is required."
        elif User.objects.filter(username=username).exists():
            errors["username"] = "Username already exists."

        if not first_name:
            errors["first_name"] = "First name is required."
        if not last_name:
            errors["last_name"] = "Last name is required."

        if not personal_email:
            errors["personal_email"] = "Email is required."
        else:
            try:
                validate_email(personal_email)
                if User.objects.filter(personal_email=personal_email).exists():
                    errors["personal_email"] = "This email is already registered."
            except ValidationError:
                errors["personal_email"] = "Enter a valid email address."

        if not password:
            errors["current_password"] = "Password is required."
        elif len(password) < 8:
            errors["current_password"] = "Password must be at least 8 characters long."

        if not gender:
            errors["gender"] = "Gender is required."
        if not year:
            errors["year"] = "Year is required."

        if not university_id:
            errors["university_name"] = "Please select a university."
        elif not University.objects.filter(id=university_id).exists():
            errors["university_name"] = "Invalid university selected."

        if not department_id:
            errors["department"] = "Please select a department."
        elif not Department.objects.filter(id=department_id).exists():
            errors["department"] = "Invalid department selected."

        if not branch_id:
            errors["branch"] = "Please select a branch."
        elif not Branch.objects.filter(id=branch_id).exists():
            errors["branch"] = "Invalid branch selected."

        # --- STOP HERE IF ERRORS ---
        if errors:
            return JsonResponse({"success": False, "errors": errors})

        # --- Create user ---
        university = University.objects.get(id=university_id)
        department = Department.objects.get(id=department_id)
        branch = Branch.objects.get(id=branch_id)

        user = User(
            username=username,
            first_name=first_name,
            last_name=last_name,
            gender=gender,
            profile_pic=request.FILES.get("profile_pic"),
            university_name=university,
            personal_email=personal_email,
            department=department,
            branch=branch,
            year=year,
            bio=data.get("bio", "").strip(),
        )
        user.set_password(password)
        user.save()

        # --- Success ---
        return JsonResponse({"success": True, "message": "Registration successful! Please login."})

    return render(request, "accounts/register.html")

# View for getting the form filled with the data from backend 
def get_choices(request):
    universities = list(University.objects.values("id", "name"))
    departments = list(Department.objects.values("id", "name"))
    branches = list(Branch.objects.values("id", "name"))

    return JsonResponse({
        "universities": universities,
        "departments": departments,
        "branches": branches,
        "years": User.YEAR_CHOICES,
        "genders": User.GENDER_CHOICES,
    })

def login_view(request):
    if request.method == "POST" and request.headers.get("x-requested-with") == "XMLHttpRequest":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "").strip()
        errors = {}

        if not username:
            errors["username"] = "Username is required."
        if not password:
            errors["password"] = "Password is required."

        if not errors:
            try:
                user = User.objects.get(username=username)
                if check_password(password, user.current_password):
                    request.session["user_id"] = user.id
                    return JsonResponse({"success": True})
                else:
                    errors["password"] = "Invalid username or password."
            except User.DoesNotExist:
                errors["username"] = "No such user."

        return JsonResponse({"success": False, "errors": errors})

    return redirect("core:home")

def logout_view(request):
    # Clear only your custom session keys
    request.session.flush()  # clears entire session safely
    
    messages.success(request, "You have been logged out successfully.")
    return redirect("core:home")

