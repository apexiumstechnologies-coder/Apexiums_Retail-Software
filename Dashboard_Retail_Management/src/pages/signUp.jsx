import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Eye,
  EyeOff,
  ShieldCheck,
  Store,
  Lock,
  ArrowRight,
  Warehouse,
  Mail,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Login modes: admin | store | wholesaler
  const [loginMode, setLoginMode] = useState("admin");

  const [showPassword, setShowPassword] = useState(false);
  const [showStorePassword, setShowStorePassword] = useState(false);
  const [showWholesalerPassword, setShowWholesalerPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    storeName: "",
    storePassword: "",
    wholesalerIdentifier: "",
    wholesalerPassword: "",
  });

  // --------------------------------------------------
  // Admin Login
  // --------------------------------------------------
  const loginMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post("/auth/login", payload);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });

      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  // --------------------------------------------------
  // Store Login
  // --------------------------------------------------
  const storeLoginMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post("/stores/login", payload);
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(`Welcome to ${data.name || "Store"} Portal!`);

      localStorage.setItem(
        "activeStore",
        JSON.stringify({
          ...data,
          role: "store",
        })
      );

      navigate("/admin/dashboard");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Store login failed."
      );
    },
  });

  // --------------------------------------------------
  // Wholesaler Login
  // --------------------------------------------------
  const wholesalerLoginMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        "/wholeSaller/login",
        payload
      );

      return response.data;
    },

    onSuccess: (data) => {
      toast.success("Welcome to Wholesaler Portal!");

      localStorage.setItem(
        "activeWholesaler",
        JSON.stringify({
          ...data,
          role: "wholesaler",
        })
      );

      navigate("/admin/dashboard");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Wholesaler login failed."
      );
    },
  });

  // --------------------------------------------------
  // Form Submit
  // --------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    // Admin
    if (loginMode === "admin") {
      if (!formData.identifier.trim() || !formData.password) {
        toast.error("Please enter Admin credentials.");
        return;
      }

      loginMutation.mutate({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      return;
    }

    // Store
    if (loginMode === "store") {
      if (!formData.storeName.trim() || !formData.storePassword) {
        toast.error("Please enter Store details.");
        return;
      }

      storeLoginMutation.mutate({
        name: formData.storeName.trim(),
        password: formData.storePassword,
      });

      return;
    }

    // Wholesaler
    if (loginMode === "wholesaler") {
      if (
        !formData.wholesalerIdentifier.trim() ||
        !formData.wholesalerPassword
      ) {
        toast.error("Please enter Wholesaler details.");
        return;
      }

      wholesalerLoginMutation.mutate({
        identifier: formData.wholesalerIdentifier.trim(),
        password: formData.wholesalerPassword,
      });
    }
  };

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------
  const isSubmitting =
    loginMutation.isPending ||
    storeLoginMutation.isPending ||
    wholesalerLoginMutation.isPending;

  // --------------------------------------------------
  // Input Handler
  // --------------------------------------------------
  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white font-sans">
      {/* =====================================================
          LEFT SIDE - BRANDING
      ====================================================== */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center bg-[#0e2a27] p-8 text-center text-white lg:flex lg:p-12">
        <div className="max-w-md animate-in fade-in zoom-in duration-700">
          <p className="mb-12 text-sm text-gray-300">
            وَاَوْفُوا الْكَيْلَ اِذَا كِلْتُمْ وَزِنُوْا بِالْقِسْطَاسِ
            الْمُسْتَقِيْمِ
          </p>

          <h1 className="mb-4 text-3xl font-bold leading-tight font-serif lg:text-4xl">
            Apexiums Retail
            <br />
            <span className="text-[#20b295]">
              Management Softwares
            </span>
          </h1>

          <p className="mb-6 text-base italic leading-relaxed text-gray-300 opacity-80">
            "We deal in all kinds of management software. We are here
            to help you make your business fully digital."
          </p>

          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Contact us
            </p>

            <p className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-2xl font-black text-white">
              03405542097
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="mt-10 inline-block rounded-full border border-[#20b295] bg-[#20b295]/20 px-6 py-2 text-lg font-black uppercase tracking-wider text-[#20b295]">
            Book A Free Demo
          </div>

          <div className="mt-10 border-t border-white/5 pt-3 lg:mt-6">
            <p className="text-[13px] font-bold uppercase tracking-[3px] text-white">
              A project of Apexiums Technologies
            </p>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/923405542097"
          target="_blank"
          rel="noreferrer"
          title="Chat with Apexiums"
          aria-label="Chat with Apexiums on WhatsApp"
          className="group absolute bottom-6 right-6 drop-shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Support"
            className="h-12 w-12 rounded-xl bg-white p-0.5 lg:h-14 lg:w-14"
          />

          <span className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-800 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            Live Support
          </span>
        </a>
      </div>

      {/* =====================================================
          RIGHT SIDE - LOGIN FORM
      ====================================================== */}
      <div className="relative flex w-full items-center justify-center overflow-y-auto p-6 md:p-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Logo Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-[#20b295] p-2.5 shadow-lg shadow-teal-500/20">
              <Building2 size={28} className="text-white" />
            </div>

            <div>
              <h2 className="text-xl font-black uppercase leading-none tracking-tighter text-gray-800">
                Apexiums
              </h2>

              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Management Software
              </p>
            </div>
          </div>

          {/* Portal Selection Tabs */}
          <div className="mb-6 grid grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 shadow-inner">
            {/* Admin */}
            <button
              type="button"
              onClick={() => setLoginMode("admin")}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-[9px] font-black uppercase transition-all sm:text-[10px] ${
                loginMode === "admin"
                  ? "bg-white text-[#13786E] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ShieldCheck size={15} />
              <span>Admin</span>
            </button>

            {/* Store */}
            <button
              type="button"
              onClick={() => setLoginMode("store")}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-[9px] font-black uppercase transition-all sm:text-[10px] ${
                loginMode === "store"
                  ? "bg-white text-[#13786E] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Store size={15} />
              <span>Store</span>
            </button>

            {/* Wholesaler */}
            <button
              type="button"
              onClick={() => setLoginMode("wholesaler")}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-[9px] font-black uppercase transition-all sm:text-[10px] ${
                loginMode === "wholesaler"
                  ? "bg-white text-[#13786E] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Warehouse size={15} />
              <span>Wholesaler</span>
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 text-left"
          >
            {/* =================================================
                ADMIN LOGIN
            ================================================== */}
            {loginMode === "admin" && (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="adminIdentifier"
                    className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    Admin Email / ID
                  </label>

                  <input
                    id="adminIdentifier"
                    type="text"
                    autoComplete="username"
                    placeholder="example@apex.com"
                    value={formData.identifier}
                    onChange={(event) =>
                      updateField(
                        "identifier",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-[#20b295]"
                  />
                </div>

                <div className="relative space-y-1.5">
                  <label
                    htmlFor="adminPassword"
                    className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    Password
                  </label>

                  <input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-[#20b295]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-[34px] text-gray-400 transition-colors hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </>
            )}

            {/* =================================================
                STORE LOGIN
            ================================================== */}
            {loginMode === "store" && (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="storeName"
                    className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    Username / ID
                  </label>

                  <div className="relative">
                    <Store
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={16}
                    />

                    <input
                      id="storeName"
                      type="text"
                      autoComplete="username"
                      placeholder="e.g. saad@gmail.com"
                      value={formData.storeName}
                      onChange={(event) =>
                        updateField(
                          "storeName",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-[#20b295]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="storePassword"
                    className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    Store Password
                  </label>

                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={16}
                    />

                    <input
                      id="storePassword"
                      type={
                        showStorePassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={formData.storePassword}
                      onChange={(event) =>
                        updateField(
                          "storePassword",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-[#20b295]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowStorePassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showStorePassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showStorePassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* =================================================
                WHOLESALER LOGIN
            ================================================== */}
            {loginMode === "wholesaler" && (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="wholesalerIdentifier"
                    className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    Wholesaler Email / ID
                  </label>

                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={16}
                    />

                    <input
                      id="wholesalerIdentifier"
                      type="text"
                      autoComplete="username"
                      placeholder="e.g. wholesaler@apex.com"
                      value={formData.wholesalerIdentifier}
                      onChange={(event) =>
                        updateField(
                          "wholesalerIdentifier",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-[#20b295]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="wholesalerPassword"
                    className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    Wholesaler Password
                  </label>

                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                      size={16}
                    />

                    <input
                      id="wholesalerPassword"
                      type={
                        showWholesalerPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={formData.wholesalerPassword}
                      onChange={(event) =>
                        updateField(
                          "wholesalerPassword",
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-[#20b295]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowWholesalerPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showWholesalerPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showWholesalerPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#13786E] py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[#0e5a52] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Authenticating..."
                : "Access Dashboard"}

              {!isSubmitting && <ArrowRight size={16} />}
            </button>

            {/* Quick Switch Helper */}
            <div className="mt-4 border-t border-gray-50 pt-4 text-center">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                Need quick switch?
              </p>

              <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase text-[#13786E]">
                {loginMode !== "admin" && (
                  <button
                    type="button"
                    onClick={() => setLoginMode("admin")}
                    className="hover:underline"
                  >
                    Admin
                  </button>
                )}

                {loginMode !== "store" && (
                  <button
                    type="button"
                    onClick={() => setLoginMode("store")}
                    className="hover:underline"
                  >
                    Store
                  </button>
                )}

                {loginMode !== "wholesaler" && (
                  <button
                    type="button"
                    onClick={() =>
                      setLoginMode("wholesaler")
                    }
                    className="hover:underline"
                  >
                    Wholesaler
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;