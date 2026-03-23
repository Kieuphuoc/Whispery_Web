import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AtSign, Lock, Eye, EyeOff, UserPlus, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MyDispatchContext } from '@/shared/AuthContext';
import { authService } from '@/services/auth-service';

const Register = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        displayName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useContext(MyDispatchContext);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user.username || !user.password) {
            setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
            return;
        }
        if (user.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Using FormData to match mobile implementation
            const formData = new FormData();
            formData.append('username', user.username.trim());
            formData.append('password', user.password.trim());
            if (user.displayName) {
                formData.append('displayName', user.displayName.trim());
            }

            const res = await authService.register(formData);

            const data = res.data;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (dispatch) {
                dispatch({ type: "SET_USER", payload: data.user });
            }

            navigate('/home');
        } catch (err: any) {
            console.error('Lỗi đăng ký:', err);
            setError(err.response?.data?.message || "Đăng ký không thành công. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setUser(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 sm:p-4 overflow-hidden">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(https://i.pinimg.com/736x/8f/4f/83/8f4f836b45cae5270f1d717af7158070.jpg)' }}
            />
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />

            {/* Content */}
            <div className="relative z-20 w-full max-w-[400px]">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/95 flex items-center justify-center mb-5 shadow-xl border-2 border-primary/20 overflow-hidden">
                        <img src="/logo.png" alt="Whisper Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Whisper of Memory</h1>
                    <p className="text-white/80 drop-shadow-sm font-medium">Join our community today</p>
                </div>

                {/* Bento Container */}
                <div className="bg-white/95 rounded-[32px] p-8 shadow-2xl backdrop-blur-sm border border-white/20">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Create Account</h2>
                        <p className="text-sm text-gray-500">Sign up to start your journey</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            placeholder="Tên hiển thị (Tùy chọn)"
                            icon={<User className="w-5 h-5 text-gray-400" />}
                            value={user.displayName}
                            onChange={(e) => handleChange('displayName', e.target.value)}
                        />

                        <Input
                            placeholder="Username"
                            icon={<AtSign className="w-5 h-5 text-gray-400" />}
                            value={user.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                        />

                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                            value={user.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            rightElement={
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            }
                        />

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-500 p-3 rounded-xl border border-red-100 mt-2 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-medium">{error}</span>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="w-full h-14 mt-4" 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>Sign Up</span>
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm mt-8">
                        <span className="text-gray-500 uppercase text-[12px] font-semibold">Already have an account? </span>
                        <Link to="/login" className="text-primary font-bold hover:underline transition-all">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
