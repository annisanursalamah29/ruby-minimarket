class SessionsController < ApplicationController
  # Halaman Login
  def new
    render inertia: 'Auth/Login'
  end

  # Proses Login
  def create
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to dashboard_path, notice: "Selamat datang kembali!"
    else
      redirect_to login_path, alert: "Email atau password salah."
    end
  end

  # Proses Logout
  def destroy
    session[:user_id] = nil
    redirect_to login_path, notice: "Berhasil keluar."
  end
end